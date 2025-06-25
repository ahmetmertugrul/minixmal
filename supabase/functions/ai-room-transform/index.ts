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

    const falaiApiKey = Deno.env.get('FALAI_API_KEY');
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

    if (!falaiApiKey || !mistralApiKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 1: Analyze the room image with LLaVA
    console.log('Step 1: Analyzing room image...');
    const analysisResponse = await fetch('https://fal.run/fal-ai/llava-next', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: "Describe this room in detail. List all visible objects, furniture, decorations, and clutter. Mention the colors, lighting, and overall feeling of the space. Be very specific about what makes it feel cluttered or disorganized."
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`LLaVA analysis failed: ${analysisResponse.statusText}`);
    }

    const analysisResult = await analysisResponse.json();
    const roomDescription = analysisResult.output;

    console.log('Room description:', roomDescription);

    // Step 2: Generate checklist and image prompt with Mistral
    console.log('Step 2: Generating checklist and transformation prompt...');
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are an expert interior designer for the "Minixmal" app. Your goal is to help users declutter and create minimalist, serene spaces. You will receive a description of a user\'s room and provide actionable advice.'
          },
          {
            role: 'user',
            content: `Based on the following room description, do two things:
1. Create a step-by-step checklist of 4-8 actionable tasks to make the room minimalist. Each task should have: task, reason, category (Decluttering/Organization/Styling), priority (high/medium/low), and estimatedTime.
2. Write a detailed, inspiring prompt for an image generation AI to create a minimalist version of this exact room, keeping the same layout and structure but removing clutter and adding minimalist styling.

Room Description: "${roomDescription}"

Provide the output as a JSON object with two keys: "checklist" (array of task objects) and "image_prompt" (string).`
          }
        ],
      }),
    });

    if (!mistralResponse.ok) {
      throw new Error(`Mistral API failed: ${mistralResponse.statusText}`);
    }

    const mistralResult = await mistralResponse.json();
    const instructions: MistralResponse = JSON.parse(mistralResult.choices[0].message.content);

    console.log('Generated instructions:', instructions);

    // Step 3: Generate transformed image with Stable Diffusion + ControlNet
    console.log('Step 3: Generating transformed image...');
    const transformResponse = await fetch('https://fal.run/fal-ai/stable-diffusion-v3-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: instructions.image_prompt + ", minimalist interior design, clean lines, organized, peaceful, high quality, professional photography",
        negative_prompt: "cluttered, messy, chaotic, dark, poor lighting, low quality",
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!transformResponse.ok) {
      throw new Error(`Image generation failed: ${transformResponse.statusText}`);
    }

    const transformResult = await transformResponse.json();
    const transformedImageUrl = transformResult.images[0].url;

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
      roomDescription,
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