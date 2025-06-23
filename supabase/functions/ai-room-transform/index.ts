import { corsHeaders } from '../_shared/cors.ts';

const FAL_API_KEY = Deno.env.get('FAL_API_KEY');

if (!FAL_API_KEY) {
  throw new Error('FAL_API_KEY environment variable is required');
}

interface TransformRequest {
  imageUrl: string;
}

interface AnalysisResult {
  roomDescription: string;
  checklist: ChecklistItem[];
  imagePrompt: string;
  transformedImageUrl: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  reason: string;
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
    const { imageUrl }: TransformRequest = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Starting AI pipeline for image:', imageUrl);

    // STEP 1: ANALYZE (Vision-to-Text with LLaVA)
    console.log('Step 1: Analyzing room with LLaVA...');
    const analysisResponse = await fetch('https://fal.run/fal-ai/llava-next', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: `Analyze this room in detail for minimalist transformation. Describe:
        1. All visible objects and furniture
        2. Current clutter level and organization
        3. Color scheme and lighting
        4. Overall feeling and atmosphere
        5. Specific items that create visual clutter
        6. Storage solutions currently visible
        7. Room type and primary function
        Be very specific and detailed in your description.`
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`LLaVA analysis failed: ${analysisResponse.statusText}`);
    }

    const analysisResult = await analysisResponse.json();
    const roomDescription = analysisResult.output;

    console.log('Step 1 complete. Room description generated.');

    // STEP 2: RECOMMENDATION (Text-to-Text with Mistral)
    console.log('Step 2: Generating recommendations with Mistral...');
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('MISTRAL_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an expert interior designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces. You will receive a detailed description of a user's room and must provide actionable transformation guidance.`
          },
          {
            role: 'user',
            content: `Based on the following room description, create two outputs:

1. A step-by-step checklist of 6-10 actionable tasks to transform this room into a minimalist space
2. A detailed, inspiring prompt for an AI image generator to create a minimalist version of this room

Room Description: "${roomDescription}"

Provide the output as a JSON object with this exact structure:
{
  "checklist": [
    {
      "task": "specific action to take",
      "category": "Decluttering|Organization|Styling",
      "priority": "high|medium|low",
      "estimatedTime": "X min",
      "reason": "why this task is important for minimalism"
    }
  ],
  "image_prompt": "A detailed prompt for image generation describing the minimalist transformation"
}`
          }
        ],
      }),
    });

    if (!mistralResponse.ok) {
      throw new Error(`Mistral API failed: ${mistralResponse.statusText}`);
    }

    const mistralResult = await mistralResponse.json();
    const instructions = JSON.parse(mistralResult.choices[0].message.content);

    console.log('Step 2 complete. Checklist and image prompt generated.');

    // STEP 3: TRANSFORM (Image-to-Image with Stable Diffusion + ControlNet)
    console.log('Step 3: Transforming image with ControlNet...');
    const transformResponse = await fetch('https://fal.run/fal-ai/flux-pro/v1.1-ultra', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `${instructions.image_prompt}, minimalist interior design, clean lines, neutral colors, uncluttered, serene atmosphere, natural lighting, high quality, 4k resolution`,
        image_url: imageUrl,
        strength: 0.7,
        guidance_scale: 7.5,
        num_inference_steps: 28,
        seed: Math.floor(Math.random() * 1000000),
      }),
    });

    if (!transformResponse.ok) {
      throw new Error(`Image transformation failed: ${transformResponse.statusText}`);
    }

    const transformResult = await transformResponse.json();
    const transformedImageUrl = transformResult.images[0].url;

    console.log('Step 3 complete. Transformed image generated.');

    // Add unique IDs to checklist items
    const checklistWithIds = instructions.checklist.map((item: any, index: number) => ({
      ...item,
      id: `task-${index + 1}`,
    }));

    const result: AnalysisResult = {
      roomDescription,
      checklist: checklistWithIds,
      imagePrompt: instructions.image_prompt,
      transformedImageUrl,
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI Pipeline Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process room transformation',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});