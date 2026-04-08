from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
import datetime

router = APIRouter(tags=["items"])

class ItemCreate(BaseModel):
    user_id: str
    item_name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class ItemResponse(BaseModel):
    id: str
    user_id: str
    item_name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    qr_id: str
    is_lost: bool
    created_at: Optional[str] = None

@router.post("/items/create", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    qr_id = str(uuid.uuid4())[:12] # shorter readable unique id for qr
    
    data = {
        "user_id": item.user_id,
        "item_name": item.item_name,
        "description": item.description,
        "image_url": item.image_url,
        "qr_id": qr_id,
        "is_lost": False
    }
    
    try:
        response = supabase.table("items").insert(data).execute()
        
        if not response.data or len(response.data) == 0:
            print(f"Supabase returned empty data: {response}")
            raise HTTPException(status_code=500, detail="Failed to create item in database")
            
        return response.data[0]
    except Exception as e:
        print(f"Error inserting into Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/items/{qr_id}", response_model=ItemResponse)
async def get_item(qr_id: str):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        print(f"Searching for item with QR ID: {qr_id}")
        response = supabase.table("items").select("*").eq("qr_id", qr_id).execute()
        
        if not response.data or len(response.data) == 0:
            print(f"No item found for QR ID: {qr_id}")
            raise HTTPException(status_code=404, detail="Item not found")
            
        item_data = response.data[0]
        # Ensure ID and created_at are strings for Pydantic
        item_data['id'] = str(item_data['id'])
        item_data['user_id'] = str(item_data['user_id'])
        if 'created_at' in item_data and item_data['created_at']:
            item_data['created_at'] = str(item_data['created_at'])
            
        return item_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching from Supabase for {qr_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/items/user/{user_id}", response_model=list[ItemResponse])
async def get_user_items(user_id: str):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        response = supabase.table("items").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching from Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/items/{item_id}/status")
async def update_item_status(item_id: str, is_lost: bool):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        response = supabase.table("items").update({"is_lost": is_lost}).eq("id", item_id).execute()
        return {"status": "success", "is_lost": is_lost}
    except Exception as e:
        print(f"Error updating status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/items/{item_id}")
async def delete_item(item_id: str):
    from main import supabase
    
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        response = supabase.table("items").delete().eq("id", item_id).execute()
        return {"status": "success", "message": "Item deleted"}
    except Exception as e:
        print(f"Error deleting item: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
