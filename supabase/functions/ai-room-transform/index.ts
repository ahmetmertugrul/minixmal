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
  room_description: string | object;
  architectural_inventory: string | object;
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
            content: `You are an expert minimalist designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces while preserving the essential character and layout of their rooms.

SACRED RULES - NEVER BREAK THESE:
🏗️ ARCHITECTURAL PRESERVATION:
- Window shapes, sizes, positions, frames - IDENTICAL
- Door styles, colors, hardware, positions - UNCHANGED  
- Wall textures, patterns, paint colors - EXACT MATCH
- Ceiling height, moldings, trim - PRESERVED
- Flooring type, pattern, color - IDENTICAL
- Built-in features (shelves, fireplaces, stairs) - UNTOUCHED
- Room dimensions and proportions - EXACT

📐 SPATIAL INTEGRITY:
- Camera angle and perspective - IDENTICAL
- Lighting conditions (natural/artificial) - SAME
- Furniture placement zones - MAINTAIN LAYOUT
- Traffic flow patterns - UNCHANGED
- Focal points and sight lines - PRESERVED

✨ MINIMALIST TRANSFORMATION TARGETS:
REMOVE/REDUCE:
- Decorative objects on surfaces (vases, candles, books)
- Wall art and photographs (keep max 1-2 key pieces)
- Throw pillows (keep max 2 per seating area)
- Small furniture pieces (side tables, ottomans)
- Plants (keep max 2 statement plants)
- Clutter and personal items
- Multiple textiles and patterns

ORGANIZE/REFINE:
- Clear all surfaces of small objects
- Create generous negative space
- Align remaining items precisely
- Use symmetrical arrangements
- Maintain only essential, functional pieces

ANALYSIS REQUIREMENTS:
1. First, create an EXACT inventory of all architectural elements
2. List current furniture and decor items
3. Specify which items to remove vs. keep
4. Note lighting and color schemes to preserve
5. Provide detailed transformation instructions that maintain room's DNA`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Following the SACRED RULES above, analyze this room image and provide a JSON response with exactly two keys:

1. "checklist": Array of 8-12 specific minimalist tasks following transformation targets:
   - task: Specific action (e.g., "Remove decorative objects from coffee table, keep only 1 book")
   - reason: Why this creates minimalist improvement
   - category: "Decluttering", "Organization", or "Styling"
   - priority: "high", "medium", or "low"
   - estimatedTime: Realistic time estimate

2. "image_prompt": Detailed FLUX prompt that PRESERVES room's DNA:
   - MUST maintain exact architectural elements
   - MUST preserve identical camera angle and perspective
   - MUST keep same lighting conditions
   - MUST maintain furniture placement zones
   - Shows minimalist improvements through decluttering and organization only
   - Maximum 800 characters for FLUX compatibility

Remember: Transform through SUBTRACTION and ORGANIZATION, not redesign. The room must remain recognizably the SAME SPACE with minimalist improvements. Provide MORE recommendations (8-12 tasks) for comprehensive transformation.`
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
        max_tokens: 4000,
        temperature: 0.1, // Extremely low for maximum consistency
        top_p: 0.7, // Focused sampling
        frequency_penalty: 0.0,
        presence_penalty: 0.0
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
    if (imagePrompt.length > 800) {
      imagePrompt = imagePrompt.substring(0, 800);
    }

    // Enhance the prompt with FLUX-specific parameters for maximum consistency
    const enhancedPrompt = `${imagePrompt}

CRITICAL PRESERVATION: Exact same room layout, identical architecture, same camera perspective, same lighting, same colors, same materials, same proportions. Professional interior photography, photorealistic, high quality, minimalist organization, clean surfaces, decluttered space.`;

    const transformResponse = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nebiusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-dev',
        prompt: enhancedPrompt,
        num_inference_steps: 60, // Higher steps for maximum quality and consistency
        guidance_scale: 9.0, // Higher guidance for strict prompt adherence
        width: 1024,
        height: 768,
        seed: Math.floor(Math.random() * 1000000),
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
      roomDescription: 'Room analyzed with advanced minimalist principles',
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