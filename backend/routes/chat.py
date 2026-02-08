from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth import get_current_user
from services.chat_service import process_chat

router = APIRouter()

# Request model
class ChatRequest(BaseModel):
    message: str

# Response model
class ChatResponse(BaseModel):
    response: str

# Main chat endpoint
@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, user=Depends(get_current_user)):
    message = payload.message.lower()

    # Example AI command handling
    if message.startswith("add"):
        return {"response": "✅ Task added (AI simulated)"}

    if "list" in message:
        return {"response": "📋 Listing your tasks"}

    # Default: process via chat_service
    response_text = process_chat(message)
    return {"response": response_text}
