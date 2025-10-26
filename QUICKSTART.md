# ⚡ Quick Start - AI Meme Generator

Get the "AI Thinks It Understands Humor" meme generator running in under 5 minutes!

## 🎯 What You'll Build

An AI that confidently creates terrible memes and explains why they're "hilarious" (they're not).

## 1️⃣ Clone & Install (2 minutes)

```bash
# You're already here!
cd dumbhacks2

# Install everything (frontend + Python agent)
npm install
```

This automatically installs both Node.js and Python dependencies!

## 2️⃣ Get Your Replicate API Key (2 minutes)

**Good news: You ONLY need Replicate! No OpenAI required!**

### Get Replicate Key (FREE)
1. Go to https://replicate.com
2. Click "Sign up" (use GitHub for instant access)
3. Go to https://replicate.com/account/api-tokens
4. Click "Create token"
5. Copy your token (starts with `r8_`)

**That's it!** No OpenAI, no other APIs, just Replicate!

## 3️⃣ Configure (30 seconds)

```bash
# Copy the example env file
cp agent/.env.example agent/.env

# Edit it
nano agent/.env
# OR
code agent/.env
# OR
vim agent/.env
```

Add your Replicate key:
```env
REPLICATE_API_TOKEN=r8_your_token_here
```

**Note:** You can leave LANGSMITH_API_KEY empty - it's optional!

## 4️⃣ Run It! (30 seconds)

```bash
npm run dev
```

Wait for both servers to start (about 10 seconds), then open:
**http://localhost:3000**

## 🎮 Try It Out!

1. **Enter a topic**: "my cat", "Monday mornings", "debugging code"
2. **Pick a humor mode**: Try "Totally Confused" for maximum chaos
3. **Click "GENERATE MEME!"**
4. **Watch AI fail at comedy** while being super confident about it
5. **Rate it** and watch AI's reaction
6. **Chat with AI** in the sidebar for even weirder memes

## 🎭 Example First Meme

**You enter:** "coffee"
**AI (96% confident):** "WHEN YOU BEVERAGE BUT IT'S LIQUID ENERGY #CAFFEINATED"
**AI explains:** "This is peak comedy because I referenced both beverages AND energy states! Plus coffee is universally relatable! I'm so good at this!"

## ⚠️ Troubleshooting

### "npm: command not found"
Install Node.js: https://nodejs.org/

### "python: command not found"
Install Python 3: https://www.python.org/downloads/

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### "Port 8123 already in use"
```bash
lsof -ti:8123 | xargs kill -9
npm run dev
```

### "Invalid API key"
- Check `agent/.env` exists
- Key should start with `r8_`
- No spaces before or after the key
- Get a new one at https://replicate.com/account/api-tokens

### "Module 'replicate' not found"
```bash
cd agent
pip install -r requirements.txt
cd ..
npm run dev
```

### Agent won't start
```bash
# Reinstall Python dependencies
npm run install:agent

# Try again
npm run dev
```

## 🎨 Humor Modes Explained

### 🤓 Trying Too Hard
- Corporate humor vibes
- Outdated references
- Maximum cringe
**Example:** "SYNERGY MONDAYS AM I RIGHT FELLOW HUMANS"

### 😵 Totally Confused
- Mixes random concepts
- Doesn't understand context
- Confidently wrong
**Example:** "POTATO COMPUTING HAPPINESS LEVELS: EXTREME"

### 🎲 Accidentally Funny
- Aims for one thing, creates chaos
- So bad it's good
- Happy accidents
**Example:** "Me trying to human: ERROR 404 SOCIAL SKILLS NOT FOUND"

### 🌪️ Maximum Chaos
- Pure absurdist energy
- Random = funny (to AI)
- Unleash the weird
**Example:** "WHEN THE VOID SCREAMS BACK BUT IT'S JUST YOUR MICROWAVE"

## 💬 Chat Commands to Try

In the sidebar, ask AI for:
- "Generate 3 memes about dogs"
- "Make it even weirder"
- "Explain why that was funny"
- "Give me maximum chaos energy"
- "Try to be relatable"

The AI will enthusiastically comply (and fail hilariously).

## 🚀 Next Steps

- ✅ **You're ready!** Start generating bad memes
- 📖 Read the full [README.md](README.md)
- 🌊 Deploy to Digital Ocean: [DEPLOYMENT.md](DEPLOYMENT.md)
- ✅ Pre-submission checklist: [HACKATHON_CHECKLIST.md](HACKATHON_CHECKLIST.md)

## 💡 Pro Tips

1. **Lower ratings make AI weirder** - It tries to "improve" by being more random
2. **Chat for variations** - "Make 5 versions of this meme"
3. **Share the explanations** - Often funnier than the memes
4. **Try all humor modes** - Each creates different flavors of awkward
5. **Give specific topics** - More context = more confused AI = funnier results

## 🎪 Demo Tips

For showcasing at DUMB HACKS:

1. **Start simple:** "Make a meme about Monday"
2. **Show the confidence:** Point out the 94% confidence
3. **Read the explanation:** This is where the magic happens
4. **Rate it low:** Show AI's reaction
5. **Generate again:** Watch it get weirder
6. **Chat interaction:** "Make it more chaotic"

People will laugh at every step!

## 🤝 What Makes This Special

- ✅ **No OpenAI needed** - Just free Replicate
- ✅ **Actually funny** - Bad memes are the feature
- ✅ **Interactive** - Chat, rate, iterate
- ✅ **Self-aware** - AI knows it's "funny" (it's not)
- ✅ **Relatable** - We've all seen AI fail at memes

---

**Now go make some hilariously bad memes!** 🤖🎨

*"I'm 97% confident this will be funny!" - AI that is 0% correct*
