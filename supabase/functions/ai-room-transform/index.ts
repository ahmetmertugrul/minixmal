import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  imageUrl: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedTime: string;
  reason?: string;
}

interface QwenResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnalysisResult {
  checklist: Array<{
    task: string;
    reason: string;
    category: string;
    priority: string;
    estimatedTime: string;
  }>;
  image_prompt: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl }: RequestBody = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const nebiusApiKey = Deno.env.get('NEBIUS_API_KEY');

    if (!nebiusApiKey) {
      return new Response(
        JSON.stringify({ error: 'Nebius API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 1: Analyze the room image with Qwen2.5-VL-72B-Instruct
    console.log('Step 1: Analyzing room image with Qwen2.5-VL...');
    const analysisResponse = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nebiusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-VL-72B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interior designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces. Analyze room images and provide actionable minimalist advice.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this room image and provide two things in JSON format:
1. Create a step-by-step checklist of 4-8 actionable tasks to make the room minimalist. Each task should have: task, reason, category (Decluttering/Organization/Styling), priority (high/medium/low), and estimatedTime.
2. Write a detailed, inspiring prompt for FLUX.1-dev image generation to create a minimalist version of this exact room, keeping the same layout and structure but removing clutter and adding minimalist styling. Keep the prompt under 2000 characters.

Provide the output as a JSON object with two keys: "checklist" (array of task objects) and "image_prompt" (string).`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      throw new Error(`Qwen analysis failed: ${analysisResponse.statusText} - ${errorText}`);
    }

    const analysisResult: QwenResponse = await analysisResponse.json();
    const analysisContent = analysisResult.choices[0].message.content;

    console.log('Analysis content:', analysisContent);

    // Parse the JSON response from Qwen
    let instructions: AnalysisResult;
    try {
      // Extract JSON from the response if it's wrapped in markdown or other text
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisContent;
      instructions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Qwen response:', parseError);
      throw new Error('Failed to parse analysis response');
    }

    console.log('Generated instructions:', instructions);

    // Step 2: Generate transformed image with FLUX.1-dev
    console.log('Step 2: Generating transformed image with FLUX.1-dev...');
    
    // Ensure the prompt is under 2000 characters for FLUX.1-dev
    let imagePrompt = instructions.image_prompt;
    if (imagePrompt.length > 1900) {
      imagePrompt = imagePrompt.substring(0, 1900) + '...';
    }

    const transformResponse = await fetch('https://api.studio.nebius.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nebiusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-dev',
        prompt: imagePrompt + ", minimalist interior design, clean lines, organized, peaceful, high quality, professional photography",
        n: 1,
        size: "1024x768",
        response_format: "url"
      }),
    });

    if (!transformResponse.ok) {
      const errorText = await transformResponse.text();
      throw new Error(`FLUX image generation failed: ${transformResponse.statusText} - ${errorText}`);
    }

    const transformResult = await transformResponse.json();
    const transformedImageUrl = transformResult.data[0].url;

    console.log('Generated image URL:', transformedImageUrl);

    // Format checklist for frontend
    const checklist: ChecklistItem[] = instructions.checklist.map((item, index) => ({
      id: (index + 1).toString(),
      task: item.task,
      category: item.category || 'Decluttering',
      priority: (item.priority as 'high' | 'medium' | 'low') || 'medium',
      completed: false,
      estimatedTime: item.estimatedTime || '30 minutes',
      reason: item.reason
    }));

    const response = {
      transformedImageUrl,
      checklist,
      roomDescription: 'Room analyzed with Qwen2.5-VL-72B-Instruct',
      imagePrompt: instructions.image_prompt,
      success: true
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-room-transform function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});