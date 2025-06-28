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

CRITICAL REQUIREMENTS for image analysis and generation:
1. PRESERVE EXACT ARCHITECTURAL FEATURES: Keep all windows, doors, built-ins, fireplaces, and structural elements in their exact positions
2. MAINTAIN ROOM LAYOUT: The furniture arrangement and room proportions must remain identical
3. PRESERVE LIGHTING CONDITIONS: Keep the same natural and artificial lighting as the original
4. MAINTAIN PERSPECTIVE: Use the exact same camera angle and viewpoint
5. PRESERVE COLOR SCHEME: Keep existing wall colors, flooring, and major fixed elements

MINIMALIST TRANSFORMATION FOCUS:
- Remove excess decorative items and clutter
- Reduce the number of small objects on surfaces
- Organize remaining items with more intentional spacing
- Create more negative space and breathing room
- Keep essential furniture but potentially reduce quantity
- Maintain functionality while reducing visual noise

The goal is to make the SAME ROOM look cleaner, more organized, and minimalist while keeping its essential character and layout completely intact.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this room image and provide a JSON response with exactly three keys:

1. "room_description": A detailed description of the current room including:
   - Architectural features (windows, doors, built-ins, fireplace, etc.)
   - Room layout and furniture arrangement
   - Lighting conditions and sources
   - Color scheme and materials
   - Current organization and clutter level
   - Key features that define the space's character

2. "checklist": An array of 4-6 specific, actionable minimalist tasks. Each task must have:
   - task: Clear, specific action (e.g., "Remove decorative items from coffee table")
   - reason: Why this specific action helps achieve minimalism
   - category: "Decluttering", "Organization", or "Styling"
   - priority: "high", "medium", or "low"
   - estimatedTime: Realistic time estimate (e.g., "15 minutes", "1 hour")

3. "image_prompt": A detailed prompt for FLUX image generation that:
   - MUST preserve the exact same room layout, architecture, and perspective
   - MUST keep all built-in features (fireplace, windows, built-ins) in identical positions
   - MUST maintain the same lighting conditions and camera angle
   - MUST preserve the same wall colors, flooring, and fixed elements
   - Shows minimalist improvements through:
     * Fewer decorative objects on surfaces
     * Better organization of remaining items
     * More negative space and cleaner surfaces
     * Reduced visual clutter while maintaining functionality
   - Maximum 1000 characters

Focus on making the SAME ROOM look minimalist, not creating a different room.`
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
        max_tokens: 3000,
        temperature: 0.2, // Very low temperature for consistent, focused responses
        top_p: 0.8, // Focused sampling for better consistency
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
    if (imagePrompt.length > 1000) {
      imagePrompt = imagePrompt.substring(0, 1000);
    }

    // Enhance the prompt with FLUX-specific quality and consistency parameters
    const enhancedPrompt = `${imagePrompt}

CRITICAL: Maintain exact same room layout, architecture, lighting, and perspective. Professional interior photography, high resolution, photorealistic, same camera angle, identical room structure, minimalist aesthetic, clean surfaces, organized space, natural lighting, architectural photography quality.`;

    const transformResponse = await fetch('https://api.studio.nebius.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nebiusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-dev',
        prompt: enhancedPrompt,
        num_inference_steps: 50, // Higher steps for better quality and consistency
        guidance_scale: 8.0, // Higher guidance for better prompt adherence
        width: 1024,
        height: 768,
        seed: Math.floor(Math.random() * 1000000), // Random seed for variety while maintaining consistency
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