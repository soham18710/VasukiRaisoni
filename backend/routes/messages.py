from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import datetime

router = APIRouter(tags=["messages"])

class MessageCreate(BaseModel):
    item_id: str
    sender_name: str
    sender_email: Optional[str] = None
    message_text: str
    receiver_id: str

class MessageResponse(BaseModel):
    id: int
    item_id: str
    sender_name: str
    sender_email: Optional[str]
    message_text: str
    receiver_id: str
    created_at: str

@router.post("/messages/send", response_model=dict)
async def send_message(msg: MessageCreate):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    data = {
        "item_id": msg.item_id,
        "sender_name": msg.sender_name,
        "sender_email": msg.sender_email,
        "message_text": msg.message_text,
        "receiver_id": msg.receiver_id
    }
    
    try:
        response = supabase.table("messages").insert(data).execute()
        return {"status": "success", "message": "Message sent to owner"}
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/messages/user/{user_id}", response_model=List[dict])
async def get_user_messages(user_id: str):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        # Join with items to get item name
        response = supabase.table("messages") \
            .select("*, items(item_name)") \
            .eq("receiver_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
