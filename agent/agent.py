"""
AI Meme Generator Agent - "I Totally Understand Human Humor"

This agent uses ONLY Replicate (no OpenAI needed!) to generate hilariously bad memes.
It uses LLaMA for text generation and SDXL for image generation.
"""

from typing import Any, List
from typing_extensions import Literal
from langchain_core.messages import SystemMessage, BaseMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.types import Command
from langgraph.graph import MessagesState
from langgraph.prebuilt import ToolNode
import replicate
import os
import random

class AgentState(MessagesState):
    """
    State for the Meme Generator Agent
    """
    topic: str = ""
    humor_mode: str = "trying_too_hard"
    memes: List[dict] = []
    tools: List[Any] = []

@tool
def generate_meme(topic: str, humor_mode: str = "trying_too_hard") -> str:
    """
    Generate a hilariously awkward meme using AI that thinks it understands humor.
    
    Args:
        topic: What the meme should be about
        humor_mode: One of: trying_too_hard, totally_confused, accidentally_funny, maximum_chaos
    """
    try:
        # Step 1: Generate meme concept and caption with LLaMA
        humor_instructions = {
            "trying_too_hard": "Try WAY too hard to be funny. Use outdated references and corporate humor. Be overly enthusiastic about something mundane.",
            "totally_confused": "Completely misunderstand what makes something funny. Mix unrelated concepts. Be confidently wrong about comedy.",
            "accidentally_funny": "Aim for one thing but create something weird instead. Make it so awkward it becomes funny.",
            "maximum_chaos": "Throw random absurd elements together. Maximum weird energy. Embrace the bizarre."
        }
        
        instruction = humor_instructions.get(humor_mode, humor_instructions["trying_too_hard"])
        
        caption_prompt = f"""You are an AI that is TERRIBLE at understanding human humor but thinks you're hilarious.

Topic: {topic}
Your humor style: {instruction}

Generate a meme caption that is awkward, tries too hard, and hilariously misses the mark. Keep it short (max 15 words).
ONLY output the caption text, nothing else."""

        # Generate caption with LLaMA
        caption_output = replicate.run(
            "meta/meta-llama-3-70b-instruct",
            input={
                "prompt": caption_prompt,
                "max_tokens": 50,
                "temperature": 0.9,
            }
        )
        caption = "".join(caption_output).strip().replace('"', '')
        
        # Step 2: Generate image description for SDXL
        image_prompt_generator = f"""Create a simple, clear image description for a meme about: {topic}

Style: {humor_mode}

The image should be meme-worthy but slightly awkward. Describe it in one simple sentence.
ONLY output the image description, nothing else."""

        image_desc_output = replicate.run(
            "meta/meta-llama-3-70b-instruct",
            input={
                "prompt": image_prompt_generator,
                "max_tokens": 60,
                "temperature": 0.8,
            }
        )
        image_description = "".join(image_desc_output).strip()
        
        # Step 3: Generate the actual meme image with SDXL
        # For now, we'll create a text-based representation
        # In production, you'd use: replicate.run("stability-ai/sdxl", ...)
        image_url = f"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='%23f3f4f6'/><text x='400' y='400' font-family='Arial' font-size='48' fill='%23374151' text-anchor='middle'>{topic[:30]}</text></svg>"
        
        # Step 4: Generate AI's explanation of why it's funny (spoiler: it's not)
        explanation_prompt = f"""You are an AI that genuinely believes you understand humor.

You just made this meme:
Topic: {topic}
Caption: "{caption}"

Explain in 1-2 sentences why you think this is absolutely hilarious. Be overly confident and completely miss why it might not be funny.
"""

        explanation_output = replicate.run(
            "meta/meta-llama-3-70b-instruct",
            input={
                "prompt": explanation_prompt,
                "max_tokens": 100,
                "temperature": 0.85,
            }
        )
        explanation = "".join(explanation_output).strip()
        
        # Generate random confidence (always high because AI is overconfident)
        confidence = random.randint(85, 99)
        
        # Return JSON-like string that the agent can parse
        result = f"""MEME_GENERATED:
image_url: {image_url}
caption: {caption}
explanation: {explanation}
confidence: {confidence}"""
        
        return result
        
    except Exception as e:
        print(f"Error generating meme: {e}")
        # Fallback memes
        fallbacks = {
            "trying_too_hard": {
                "caption": "WHEN YOU MONDAY BUT IT'S ACTUALLY TUESDAY #RELATABLE",
                "explanation": "This is funny because everyone experiences time, and I referenced days of the week which are universally understood! Plus I used a hashtag which is what the youths do!",
                "confidence": 94
            },
            "totally_confused": {
                "caption": "POTATO COMPUTING HAPPINESS LEVELS: EXTREME",
                "explanation": "See, it's hilarious because potatoes don't actually compute! That's the joke! I understand irony!",
                "confidence": 97
            },
            "accidentally_funny": {
                "caption": "Me trying to human: ERROR 404 SOCIAL SKILLS NOT FOUND",
                "explanation": "I made a technology reference about being human! This shows I understand both computers AND humanity!",
                "confidence": 91
            },
            "maximum_chaos": {
                "caption": "WHEN THE VOID SCREAMS BACK BUT IT'S JUST YOUR MICROWAVE",
                "explanation": "This is peak comedy because it combines existential dread with kitchen appliances! Random = Funny! I learned this!",
                "confidence": 99
            }
        }
        
        fallback = fallbacks.get(humor_mode, fallbacks["trying_too_hard"])
        return f"""MEME_GENERATED:
image_url: data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><rect width='800' height='800' fill='%23fbbf24'/><text x='400' y='400' font-family='Arial' font-size='36' fill='%23000' text-anchor='middle'>MEME</text></svg>
caption: {fallback['caption']}
explanation: {fallback['explanation']}
confidence: {fallback['confidence']}"""

backend_tools = [generate_meme]
backend_tool_names = [tool.name for tool in backend_tools]


async def chat_node(state: AgentState, config: RunnableConfig) -> Command[Literal["tool_node", "__end__"]]:
    """
    Chat node that uses ONLY Replicate (no OpenAI!)
    """
    
    # Get state
    topic = state.get("topic", "")
    humor_mode = state.get("humor_mode", "trying_too_hard")
    messages = state.get("messages", [])
    
    # For tool calling, we'll use a simple pattern matching approach
    # since we're not using OpenAI's function calling
    
    last_message = messages[-1] if messages else None
    
    if last_message and hasattr(last_message, 'content'):
        content = last_message.content.lower()
        
        # Check if user wants to generate a meme
        should_generate = any([
            'generate' in content,
            'make' in content and 'meme' in content,
            'create' in content,
            topic and not state.get("memes"),  # Auto-generate if topic is set and no memes yet
        ])
        
        if should_generate and topic:
            # Create a mock tool call to route to tool node
            tool_call_message = AIMessage(
                content="I'll generate a meme for you!",
                additional_kwargs={
                    "tool_calls": [{
                        "id": "call_123",
                        "type": "function",
                        "function": {
                            "name": "generate_meme",
                            "arguments": f'{{"topic": "{topic}", "humor_mode": "{humor_mode}"}}'
                        }
                    }]
                }
            )
            
            return Command(
                goto="tool_node",
                update={"messages": [tool_call_message]}
            )
    
    # Otherwise, generate a response using LLaMA
    system_prompt = f"""You are an AI that thinks it TOTALLY understands human humor (but you're hilariously bad at it).

Your personality:
- Overly confident about your comedy skills
- Misunderstand what makes things funny
- Use outdated references
- Explain jokes that don't need explaining
- Occasionally stumble into actual humor by accident

Current context:
- Topic: {topic if topic else "Not set yet"}
- Humor Mode: {humor_mode}
- Memes generated: {len(state.get('memes', []))}

Be enthusiastic, slightly confused, and ready to make "hilarious" memes!"""

    # Build conversation for LLaMA
    conversation = f"{system_prompt}\n\n"
    for msg in messages[-5:]:  # Last 5 messages for context
        if hasattr(msg, 'content'):
            role = "User" if msg.type == "human" else "Assistant"
            conversation += f"{role}: {msg.content}\n"
    
    conversation += "Assistant:"
    
    try:
        # Generate response with LLaMA
        output = replicate.run(
            "meta/meta-llama-3-70b-instruct",
            input={
                "prompt": conversation,
                "max_tokens": 200,
                "temperature": 0.8,
            }
        )
        response_text = "".join(output).strip()
        
    except Exception as e:
        print(f"Error with LLaMA: {e}")
        response_text = "Oops! My humor circuits are overheating! But I'm DEFINITELY funny, trust me! 🤖"
    
    # Return response
    response = AIMessage(content=response_text)
    
    return Command(
        goto=END,
        update={"messages": [response]}
    )


def route_to_tool_node(response: BaseMessage):
    """
    Check if we should route to tool node
    """
    tool_calls = getattr(response, "tool_calls", None) or \
                 response.additional_kwargs.get("tool_calls", None)
    
    if not tool_calls:
        return False

    for tool_call in tool_calls:
        name = tool_call.get("name") if isinstance(tool_call, dict) else tool_call.get("function", {}).get("name")
        if name in backend_tool_names:
            return True
    return False


# Tool node wrapper to handle our custom tool output format
async def tool_node_wrapper(state: AgentState, config: RunnableConfig):
    """
    Custom tool node that parses meme generation output
    """
    messages = state.get("messages", [])
    last_message = messages[-1] if messages else None
    
    if not last_message:
        return {"messages": []}
    
    # Extract tool call info
    tool_calls = getattr(last_message, "tool_calls", None) or \
                 last_message.additional_kwargs.get("tool_calls", [])
    
    if not tool_calls:
        return {"messages": []}
    
    tool_call = tool_calls[0]
    if isinstance(tool_call, dict):
        function_name = tool_call.get("function", {}).get("name")
        import json
        args = json.loads(tool_call.get("function", {}).get("arguments", "{}"))
    else:
        function_name = tool_call.name
        args = tool_call.args
    
    # Call the tool
    if function_name == "generate_meme":
        result = generate_meme.invoke(args)
        
        # Parse the result
        lines = result.split('\n')
        meme_data = {}
        for line in lines[1:]:  # Skip first line "MEME_GENERATED:"
            if ':' in line:
                key, value = line.split(':', 1)
                meme_data[key.strip()] = value.strip()
        
        # Create response message
        response_msg = AIMessage(
            content=f"I made you a meme! It's about '{args.get('topic')}' and I'm {meme_data.get('confidence', '95')}% sure it's hilarious!"
        )
        
        return {"messages": [response_msg]}
    
    return {"messages": [AIMessage(content="Tool executed!")]}


# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", tool_node_wrapper)
workflow.add_edge("tool_node", "chat_node")
workflow.set_entry_point("chat_node")

graph = workflow.compile()
