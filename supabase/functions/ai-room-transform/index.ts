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

interface FluxResponse {
  data: Array<{
    url: string;
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
  room_description: string;
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
    const analysisResponse = await fetch('https://api.studio.nebius.com/v1/chat/completions', {
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
            content: `You are an expert minimalist interior designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces while preserving the essential character and layout of their rooms.

IMPORTANT: When creating image prompts, you must preserve:
- The exact room layout and architecture
- Window positions and natural lighting
- Built-in features (fireplace, built-ins, etc.)
- Room proportions and perspective
- The overall spatial arrangement

Focus on minimalist improvements through:
- Reducing visual clutter and excess items
- Organizing remaining items thoughtfully
- Enhancing natural light and clean lines
- Using neutral, calming color palettes
- Maintaining functionality while reducing quantity`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this room image and provide a JSON response with three keys:

1. "room_description": A detailed description of the current room layout, architecture, lighting, and key features that should be preserved.

2. "checklist": An array of 4-6 actionable minimalist tasks. Each task should have:
   - task: Clear, specific action to take
   - reason: Why this helps achieve minimalism
   - category: "Decluttering", "Organization", or "Styling"
   - priority: "high", "medium", or "low"
   - estimatedTime: Realistic time estimate

3. "image_prompt": A detailed prompt for FLUX image generation that:
   - Preserves the EXACT same room layout, architecture, and perspective
   - Keeps all built-in features (fireplace, windows, built-ins) in the same positions
   - Maintains the same lighting conditions and room proportions
   - Shows the same room but with minimalist improvements:
     * Reduced clutter and excess decorative items
     * Better organization of remaining items
     * Cleaner surfaces with more negative space
     * Neutral color palette (whites, beiges, soft grays)
     * Same furniture arrangement but potentially fewer pieces
   - Limit to 1200 characters maximum

Ensure the transformed room is recognizably the SAME space but with minimalist principles applied.`
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
        max_tokens: 2500,
        temperature: 0.3 // Lower temperature for more consistent, focused responses
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('Qwen analysis failed:', errorText);
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

    // Step 2: Generate transformed image with FLUX
    console.log('Step 2: Generating transformed image with FLUX...');
    
    // Ensure the prompt is optimized for FLUX and under character limit
    let imagePrompt = instructions.image_prompt;
    if (imagePrompt.length > 1200) {
      imagePrompt = imagePrompt.substring(0, 1200);
    }

    // Enhance the prompt with FLUX-specific quality and style parameters
    const enhancedPrompt = `${imagePrompt}

Style: Professional interior photography, minimalist design, clean aesthetic, natural lighting, high resolution, architectural photography, serene atmosphere, neutral color palette, organized space, uncluttered surfaces, modern minimalism`;

    const transformResponse = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nebiusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-dev',
        prompt: enhancedPrompt,
        num_inference_steps: 50, // Higher steps for better quality
        guidance_scale: 7.5, // Balanced guidance for prompt adherence
        width: 1024,
        height: 768,
        seed: Math.floor(Math.random() * 1000000) // Random seed for variety
      }),
    });

    if (!transformResponse.ok) {
      const errorText = await transformResponse.text();
      console.error('FLUX image generation failed:', errorText);
      throw new Error(`FLUX image generation failed: ${transformResponse.statusText} - ${errorText}`);
    }

    const transformResult: FluxResponse = await transformResponse.json();
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
      roomDescription: instructions.room_description || 'Room analyzed with Qwen2.5-VL-72B-Instruct',
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