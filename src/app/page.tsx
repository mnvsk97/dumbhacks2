"use client";

import { useCoAgent, useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";

export default function MemeGeneratorPage() {
  return (
    <main style={{ "--copilot-kit-primary-color": "#6366f1" } as CopilotKitCSSProperties}>
      <MemeGeneratorContent />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "AI Meme Assistant",
          initial: "🤖 Hi! I'm an AI that thinks it understands humor.\n\n**I can generate memes!**\n\nJust tell me:\n- What topic you want a meme about\n- Pick a 'humor mode'\n\nI'll generate a meme and explain why it's funny.\n\nYou can also chat with me for custom memes!"
        }}
      />
    </main>
  );
}

// State of the agent
type AgentState = {
  topic: string;
  humor_mode: string;
  memes: Array<{
    image_url: string;
    caption: string;
    explanation: string;
    confidence: number;
    rating?: number;
  }>;
}

function MemeGeneratorContent() {
  const [topic, setTopic] = useState("");
  const [humorMode, setHumorMode] = useState("trying_too_hard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [memes, setMemes] = useState<Array<{
    image_url: string;
    caption: string;
    explanation: string;
    confidence: number;
    rating?: number;
  }>>([]);

  // Chat with agent (keep for sidebar)
  const { append } = useCopilotChat();

  // Shared State with agent (keep for sidebar)
  const { state, setState } = useCoAgent<AgentState>({
    name: "meme_agent",
    initialState: {
      topic: "",
      humor_mode: "trying_too_hard",
      memes: [],
    },
  });

  // Frontend Action: Add generated meme
  useCopilotAction({
    name: "addMeme",
    parameters: [
      { name: "image_url", description: "The URL of the generated meme image", required: true },
      { name: "caption", description: "The meme caption/text", required: true },
      { name: "explanation", description: "AI's explanation of why it's funny", required: true },
      { name: "confidence", description: "How confident the AI is (1-100)", required: true },
    ],
    handler: ({ image_url, caption, explanation, confidence }) => {
      setState({
        ...state,
        memes: [...(state.memes || []), { image_url, caption, explanation, confidence, rating: 0 }],
      });
      setIsGenerating(false);
    },
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Call our simple API
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, humor_mode: humorMode }),
      });

      const data = await response.json();
      
      if (data.success && data.meme) {
        // Add the new meme to local state
        setMemes(prev => [...prev, { ...data.meme, rating: 0 }]);
      }
    } catch (error) {
      console.error("Error generating meme:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRating = (index: number, rating: number) => {
    const updatedMemes = [...memes];
    updatedMemes[index] = { ...updatedMemes[index], rating };
    setMemes(updatedMemes);
  };

  const humorModes = [
    { id: "trying_too_hard", label: "🤓 Trying Too Hard", desc: "Maximum effort, minimum funny" },
    { id: "totally_confused", label: "😵 Totally Confused", desc: "What even is humor?" },
    { id: "accidentally_funny", label: "🎲 Accidentally Funny", desc: "So bad it's good" },
    { id: "maximum_chaos", label: "🌪️ Maximum Chaos", desc: "Unleash the weird" },
  ];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">
            AI Meme Generator
          </h1>
          <p className="text-xl text-indigo-200 mb-2">
            Powered by Replicate AI
          </p>
          <p className="text-slate-300 text-sm">
            Generate creative memes with AI-powered humor
          </p>
          <p className="text-slate-400 text-xs mt-2">
            A DUMB HACKS 2 Project
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="mb-6">
            <label className="block text-slate-700 text-lg font-semibold mb-2">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Monday mornings, debugging code, coffee..."
              className="w-full p-3 border-2 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* Humor Mode Selection */}
          <div className="mb-6">
            <label className="block text-slate-700 text-lg font-semibold mb-2">
              Humor Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {humorModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setHumorMode(mode.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    humorMode === mode.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="font-semibold">{mode.label}</div>
                  <div className="text-sm opacity-75">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {isGenerating ? '⏳ Generating...' : 'Generate Meme'}
          </button>
        </div>

        {/* Generated Memes */}
        {memes && memes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Generated Memes
            </h2>
            {memes.map((meme, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Meme Image */}
                  <div className="relative">
                    <div className="bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-300 aspect-square flex items-center justify-center">
                      {meme.image_url ? (
                        <img 
                          src={meme.image_url} 
                          alt="Generated meme" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-6xl mb-4">🎨</div>
                          <div className="text-gray-600 font-bold">Meme Image</div>
                          <div className="text-sm text-gray-500 mt-2">{meme.caption}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Confidence Badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                      {meme.confidence}% Confident
                    </div>
                  </div>

                  {/* Meme Details */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Caption
                      </h3>
                      <p className="text-lg font-medium text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        &quot;{meme.caption}&quot;
                      </p>

                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        AI Explanation
                      </h3>
                      <p className="text-slate-700 bg-indigo-50 p-4 rounded-lg border border-indigo-200 italic text-sm leading-relaxed">
                        {meme.explanation}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">
                        Rate this meme
                      </h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(index, star)}
                            className={`text-3xl transition-transform hover:scale-110 ${
                              (meme.rating || 0) >= star ? 'opacity-100' : 'opacity-25'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                      {meme.rating && meme.rating < 3 && (
                        <p className="text-xs text-slate-500 mt-2 italic">
                          AI: &quot;I&apos;ll try different humor next time!&quot;
                        </p>
                      )}
                      {meme.rating && meme.rating >= 4 && (
                        <p className="text-xs text-slate-500 mt-2 italic">
                          AI: &quot;Glad you enjoyed it!&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!memes || memes.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              Ready to generate memes?
            </h3>
            <p className="text-slate-600">
              Enter a topic above and let AI create something interesting!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-slate-400 text-xs">
          <p>Powered by Replicate + Digital Ocean</p>
        </div>
      </div>
    </div>
  );
}
