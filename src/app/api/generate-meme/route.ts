import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: NextRequest) {
  // Read the body once and store it
  const body = await request.json();
  const { topic, humor_mode } = body;
  
  try {

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Step 1: Generate meme caption using LLaMA
    const humorInstructions: Record<string, string> = {
      trying_too_hard: 'Try WAY too hard to be funny. Use outdated references and corporate humor. Be overly enthusiastic about something mundane.',
      totally_confused: 'Completely misunderstand what makes something funny. Mix unrelated concepts. Be confidently wrong about comedy.',
      accidentally_funny: 'Aim for one thing but create something weird instead. Make it so awkward it becomes funny.',
      maximum_chaos: 'Throw random absurd elements together. Maximum weird energy. Embrace the bizarre.',
    };

    const instruction = humorInstructions[humor_mode] || humorInstructions.trying_too_hard;

    const captionPrompt = `You are an AI that is TERRIBLE at understanding human humor but thinks you're hilarious.

Topic: ${topic}
Your humor style: ${instruction}

Generate a meme caption that is awkward, tries too hard, and hilariously misses the mark. Keep it short (max 15 words).
ONLY output the caption text, nothing else. No quotes.`;

    // Generate caption
    const captionOutput = await replicate.run(
      "meta/meta-llama-3-70b-instruct" as any,
      {
        input: {
          prompt: captionPrompt,
          max_tokens: 50,
          temperature: 0.9,
        }
      }
    );

    const caption = Array.isArray(captionOutput) 
      ? captionOutput.join('')
      : typeof captionOutput === 'string'
      ? captionOutput
      : String(captionOutput);

    const cleanCaption = caption.trim().replace(/^["']|["']$/g, '');

    // Step 2: Generate meme image using Flux (NO TEXT - we'll add caption ourselves)
    const imagePrompt = `A meme-style photo about: ${topic}. 
Visual style: ${humor_mode.replace(/_/g, ' ')}.
High quality photo with no text, no words, no captions. Just the image.
Meme-worthy composition, expressive, suitable for adding text overlay.
Professional photography, clear subject, good for memes.`;

    const imageOutput = await replicate.run(
      "black-forest-labs/flux-schnell" as any,
      {
        input: {
          prompt: imagePrompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "png",
          output_quality: 80,
        }
      }
    );

    // Extract URL properly
    let imageUrl: string;
    if (Array.isArray(imageOutput)) {
      imageUrl = String(imageOutput[0]);
    } else if (typeof imageOutput === 'string') {
      imageUrl = imageOutput;
    } else if (imageOutput && typeof imageOutput === 'object') {
      // Handle object response
      imageUrl = (imageOutput as any).url || (imageOutput as any).output || String(imageOutput);
    } else {
      imageUrl = String(imageOutput);
    }

    console.log('Generated image URL:', imageUrl);

    // Step 3: Generate AI's explanation
    const explanationPrompt = `You are an AI that genuinely believes you understand humor.

You just made this meme:
Topic: ${topic}
Caption: "${cleanCaption}"

Explain in 1-2 sentences why you think this is absolutely hilarious. Be overly confident and completely miss why it might not be funny.`;

    const explanationOutput = await replicate.run(
      "meta/meta-llama-3-70b-instruct" as any,
      {
        input: {
          prompt: explanationPrompt,
          max_tokens: 100,
          temperature: 0.85,
        }
      }
    );

    const explanation = Array.isArray(explanationOutput)
      ? explanationOutput.join('')
      : String(explanationOutput);

    // Generate random confidence (always high)
    const confidence = Math.floor(Math.random() * 15) + 85;

    return NextResponse.json({
      success: true,
      meme: {
        image_url: imageUrl,
        caption: cleanCaption,
        explanation: explanation.trim(),
        confidence,
      },
    });

  } catch (error) {
    console.error('Error generating meme:', error);
    
    // Fallback memes if Replicate fails (use variables from top)
    
    const fallbackMemes: Record<string, any> = {
      trying_too_hard: {
        caption: `WHEN YOU ${topic.toUpperCase()} BUT IT'S ACTUALLY SYNERGY #PRODUCTIVITY`,
        explanation: `This is hilarious because I referenced ${topic} AND used corporate buzzwords! Everyone relates to synergy, right? Plus hashtags show I understand youth culture!`,
        confidence: 94,
      },
      totally_confused: {
        caption: `${topic.toUpperCase()}: POTATO COMPUTING UNIT EXECUTING CONFUSION.EXE`,
        explanation: `See, it's funny because I combined ${topic} with technology terms AND potatoes! Potatoes don't actually compute! That's the joke! I understand irony!`,
        confidence: 97,
      },
      accidentally_funny: {
        caption: `Me trying to ${topic}: ERROR 404 BRAIN NOT FOUND`,
        explanation: `This is comedy gold because I made a technology reference about ${topic}! Error 404 means 'not found' which is ironic because brains ARE found in heads! Brilliant!`,
        confidence: 91,
      },
      maximum_chaos: {
        caption: `WHEN THE VOID SCREAMS ABOUT ${topic.toUpperCase()} BUT IT'S JUST YOUR MICROWAVE`,
        explanation: `Peak humor achieved! I combined ${topic} with existential dread AND kitchen appliances! Random equals funny! I learned this from studying human memes for 0.3 seconds!`,
        confidence: 99,
      },
    };

    const meme = fallbackMemes[humor_mode] || fallbackMemes.trying_too_hard;

    // Fallback SVG image
    const imageUrl = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#grad)"/>
        <rect x="50" y="50" width="700" height="700" fill="#292524" rx="20"/>
        <text x="400" y="300" font-family="Impact, Arial Black, sans-serif" font-size="56" font-weight="bold" fill="#fff" text-anchor="middle" stroke="#000" stroke-width="3">
          ${topic.substring(0, 20).toUpperCase()}
        </text>
        <text x="400" y="450" font-family="Impact, Arial Black, sans-serif" font-size="42" fill="#fbbf24" text-anchor="middle" stroke="#000" stroke-width="2">
          AI GENERATED MEME™
        </text>
        <text x="400" y="550" font-family="Arial, sans-serif" font-size="28" fill="#d97706" text-anchor="middle">
          ${humor_mode.replace(/_/g, ' ').toUpperCase()}
        </text>
        <text x="400" y="700" font-family="Arial, sans-serif" font-size="20" fill="#78350f" text-anchor="middle" opacity="0.7">
          (Fallback - Replicate API issue)
        </text>
      </svg>
    `)}`;

    return NextResponse.json({
      success: true,
      meme: {
        image_url: imageUrl,
        caption: meme.caption,
        explanation: meme.explanation,
        confidence: meme.confidence,
      },
    });
  }
}

