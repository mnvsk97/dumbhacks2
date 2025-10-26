# 🤖 AI MEME GENERATOR - "I Totally Understand Human Humor"

**Spoiler: It doesn't**

An AI that thinks it TOTALLY gets comedy but creates hilariously awkward memes instead. Built with LangGraph, CopilotKit, Replicate, and Next.js for DUMB HACKS 2 - where the dumbest idea wins! 🏆

## 🎭 What is this?

Ever wondered what would happen if an AI tried to understand memes but completely missed the point? Wonder no more!

**AI Meme Generator** features:
- An overly confident AI that thinks it's hilarious
- 4 "humor modes" (all equally awkward)
- Confidence meter (always hilariously high)
- AI explanations of why its memes are "funny" (they're not)
- Rating system that makes the AI try harder (and fail more)
- 100% powered by Replicate - **NO OpenAI API key needed!**

**The twist:** Bad memes are the FEATURE, not a bug. The worse it is, the better it works!

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + React 19 + TailwindCSS
- **AI Agent:** LangGraph + CopilotKit
- **AI Models:** Replicate ONLY (LLaMA 3 70B for text)
- **Backend:** Python + FastAPI
- **Deployment:** Digital Ocean ready
- **Best Part:** No OpenAI needed! Just Replicate!

## 🌟 Why This is Different

Unlike other meme generators that:
- Use templates (boring!)
- Try to make GOOD memes
- Work perfectly

This one:
- ✅ Generates original awkward content
- ✅ Intentionally misses the mark
- ✅ Has personality (confused AI personality)
- ✅ Gets more confident as it fails harder
- ✅ Actually makes you laugh (at the AI, not with it)

## Prerequisites

- Node.js 18+ 
- Python 3.8+
- Package manager (pnpm/npm/yarn/bun)
- **ONLY Replicate API Key** (no OpenAI!) - [Get one free here](https://replicate.com/account/api-tokens)

## ⚡ Quick Start

### 1. Install Dependencies (2 minutes)
```bash
npm install
# This automatically installs Python dependencies too!
```

### 2. Get Your Replicate API Key (2 minutes)
1. Go to https://replicate.com
2. Sign up (free!)
3. Go to https://replicate.com/account/api-tokens
4. Copy your token

### 3. Configure (30 seconds)
```bash
cp agent/.env.example agent/.env
# Edit agent/.env and add:
REPLICATE_API_TOKEN=r8_your_token_here
```

### 4. Run It! (30 seconds)
```bash
npm run dev
```

Open http://localhost:3000 and watch AI fail at comedy! 🎉

## 🎮 How to Use

1. **Enter a topic** - "Monday mornings", "my cat", "debugging code"
2. **Pick a humor mode**:
   - 🤓 Trying Too Hard - Corporate humor energy
   - 😵 Totally Confused - Maximum confusion
   - 🎲 Accidentally Funny - So bad it's good
   - 🌪️ Maximum Chaos - Embrace the weird
3. **Click Generate** - Watch AI think it's hilarious
4. **Read the explanation** - AI explains why it's "funny"
5. **Rate it** - Make AI even more confused
6. **Chat with AI** - Ask for weirder versions!

## 🎯 Key Features

### 1. Multiple Humor Modes
Each mode makes AI approach comedy differently (all badly):
- **Trying Too Hard**: Outdated references + corporate speak
- **Totally Confused**: Mixes unrelated concepts
- **Accidentally Funny**: Aims for one thing, creates chaos
- **Maximum Chaos**: Pure absurdist energy

### 2. Confidence Meter
AI is always 85-99% confident it's hilarious. It never learns.

### 3. AI Explanations
After each meme, AI proudly explains why it's funny. These explanations are often funnier than the memes.

### 4. Rating System
Rate memes 1-5 stars:
- Low rating: "I'll be even weirder next time!"
- High rating: "SEE? I told you I understand humor!"

### 5. Chat Integration
Talk to the confused AI:
- "Make it more chaotic"
- "Explain why this is funny"
- "Generate 3 memes about cats"

## 📁 Project Structure

```
dumbhacks2/
├── src/app/
│   ├── page.tsx                 # Meme generator UI
│   └── api/copilotkit/route.ts  # API endpoint
├── agent/
│   ├── agent.py                 # LangGraph agent (Replicate only!)
│   ├── requirements.txt         # Python deps (no openai!)
│   └── langgraph.json          # Agent config
└── docs/
```

## 🚀 Available Scripts

```bash
npm run dev        # Start both UI and agent
npm run dev:ui     # Start only Next.js
npm run dev:agent  # Start only Python agent
npm run build      # Build for production
npm install:agent  # Reinstall Python dependencies
```

## 🌊 Deploy to Digital Ocean

### Quick Deploy (Recommended)
1. Push to GitHub
2. Go to [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
3. Connect your repo
4. Add environment variable: `REPLICATE_API_TOKEN`
5. Deploy! 🚀

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🎪 Why This is "DUMB" (and Perfect for DUMB HACKS)

1. **Embraces Failure**: Bad memes are the goal
2. **Over-Engineered**: Complex AI for simple (terrible) memes
3. **Self-Aware**: AI thinks it's funny but isn't
4. **Actually Entertaining**: Makes people laugh at AI's confusion
5. **Relatable**: We've all seen AI-generated cringe

## 🤝 Example Interactions

**User:** "Make a meme about Monday mornings"

**AI (95% confident):** *Generates meme*
> Caption: "WHEN YOU MONDAY BUT IT'S ACTUALLY TUESDAY #SYNERGY"
>
> Explanation: "This is hilarious because I referenced both Monday AND Tuesday, creating a temporal paradox of relatability! Plus I used a hashtag which demonstrates my understanding of youth culture!"

**User:** *Rates 2 stars*

**AI:** "Noted. I'll add more temporal paradoxes next time!"

## 🐛 Troubleshooting

### "Module not found: replicate"
```bash
cd agent && pip install -r requirements.txt
```

### "Invalid API key"
- Check `agent/.env`
- Key should start with `r8_`
- Get a free key at https://replicate.com

### Port issues
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:8123 | xargs kill -9
```

## 💡 Making It Even Dumber (Optional Enhancements)

- Add sound effects (laugh track when AI explains jokes)
- "Meme of the Day" feature
- Community voting on worst memes
- AI learns from bad ratings (gets worse, not better)
- Voice output for AI reading explanations dramatically
- "Deep fried" mode with more visual chaos

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Digital Ocean deployment
- [HACKATHON_CHECKLIST.md](HACKATHON_CHECKLIST.md) - Pre-submission list
- [Replicate Docs](https://replicate.com/docs)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)

## 🏆 For DUMB HACKS 2 Judges

**What makes this perfectly dumb:**
- Uses AI for something it's hilariously bad at
- The worse it performs, the better it succeeds
- Meta-commentary on AI limitations through comedy
- Over-engineered solution to non-existent problem
- Actually entertaining (laughing AT the AI)

**Technical Highlights:**
- ✅ Replicate integration (LLaMA 3 70B)
- ✅ Digital Ocean deployment ready
- ✅ NO OpenAI required
- ✅ Modern stack (Next.js 15, React 19)
- ✅ LangGraph agents
- ✅ Fully functional end-to-end

**Demo Flow:**
1. "Let's make a meme about coffee"
2. Pick "Totally Confused" mode
3. Watch AI generate something bizarre
4. Read AI's explanation (funnier than the meme)
5. Rate it low, watch AI double down
6. Repeat until everyone is laughing

## 📄 License

MIT License - Use it to confuse AI everywhere!

## 🙏 Acknowledgments

- DUMB HACKS 2 for celebrating absurdity
- Replicate for accessible AI
- Every AI that's ever tried to understand memes
- All the awkward memes AI has inflicted upon the world

---

**"I understand humor!" - AI that doesn't understand humor**

Built with 🤖 and confusion for DUMB HACKS 2
