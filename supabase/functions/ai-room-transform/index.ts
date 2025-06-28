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

interface MistralResponse {
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

interface FalImageResponse {
  image: {
    url: string;
  };
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

    const falApiKey = Deno.env.get('FAL_API_KEY');
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

    if (!falApiKey || !mistralApiKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured. Please set FAL_API_KEY and MISTRAL_API_KEY.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 1: Analyze the room image with Mistral via Fal AI
    console.log('Step 1: Analyzing room image with Mistral...');
    const analysisResponse = await fetch('https://api.fal.ai/llm/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct-v0.2',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interior designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces. Analyze room descriptions and provide actionable minimalist advice.'
          },
          {
            role: 'user',
            content: `Based on a cluttered room image, provide two things in JSON format:
1. Create a step-by-step checklist of 4-8 actionable tasks to make the room minimalist. Each task should have: task, reason, category (Decluttering/Organization/Styling), priority (high/medium/low), and estimatedTime.
2. Write a detailed, inspiring prompt for FLUX.1-dev image generation to create a minimalist version of this room, keeping the same layout and structure but removing clutter and adding minimalist styling. Keep the prompt under 1500 characters.

Provide the output as a JSON object with two keys: "checklist" (array of task objects) and "image_prompt" (string).

Example room: A cluttered bedroom with clothes on the floor, unmade bed, and items scattered on surfaces.`
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      throw new Error(`Mistral analysis failed: ${analysisResponse.statusText} - ${errorText}`);
    }

    const analysisResult: MistralResponse = await analysisResponse.json();
    const analysisContent = analysisResult.choices[0].message.content;

    console.log('Analysis content:', analysisContent);

    // Parse the JSON response from Mistral
    let instructions: AnalysisResult;
    try {
      // Extract JSON from the response if it's wrapped in markdown or other text
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisContent;
      instructions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Mistral response:', parseError);
      // Fallback with default instructions if parsing fails
      instructions = {
        checklist: [
          {
            task: "Remove all items from surfaces",
            reason: "Clear surfaces create visual calm and make spaces feel larger",
            category: "Decluttering",
            priority: "high",
            estimatedTime: "30 minutes"
          },
          {
            task: "Organize belongings into designated storage",
            reason: "Everything should have a specific place to maintain order",
            category: "Organization",
            priority: "high",
            estimatedTime: "45 minutes"
          },
          {
            task: "Keep only essential items visible",
            reason: "Minimalism focuses on functionality and reduces visual noise",
            category: "Decluttering",
            priority: "medium",
            estimatedTime: "20 minutes"
          },
          {
            task: "Add simple, natural elements",
            reason: "Plants or natural materials bring life without clutter",
            category: "Styling",
            priority: "low",
            estimatedTime: "15 minutes"
          }
        ],
        image_prompt: "A serene, minimalist room with clean lines, organized surfaces, neutral colors, natural light, and only essential items visible. Modern minimalist interior design, uncluttered, peaceful atmosphere, high quality photography."
      };
    }

    console.log('Generated instructions:', instructions);

    // Step 2: Generate transformed image with FLUX.1-dev via Fal AI
    console.log('Step 2: Generating transformed image with FLUX.1-dev...');
    
    // Ensure the prompt is under 1500 characters for FLUX.1-dev
    let imagePrompt = instructions.image_prompt;
    if (imagePrompt.length > 1400) {
      imagePrompt = imagePrompt.substring(0, 1400) + '...';
    }

    const transformResponse = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: imagePrompt + ", minimalist interior design, clean lines, organized, peaceful, high quality, professional photography",
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true
      }),
    });

    if (!transformResponse.ok) {
      const errorText = await transformResponse.text();
      throw new Error(`FLUX image generation failed: ${transformResponse.statusText} - ${errorText}`);
    }

    const transformResult = await transformResponse.json();
    const transformedImageUrl = transformResult.images[0].url;

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
      roomDescription: 'Room analyzed with Mistral AI',
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