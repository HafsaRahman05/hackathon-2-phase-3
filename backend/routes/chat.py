from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel
from auth import get_current_user
from routes.tasks import create_task, get_tasks, update_task, delete_task, toggle_task_completion
from models import TaskCreate, TaskUpdate, TaskCompletionToggle
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_session
from typing import List

router = APIRouter()


# Request/Response Models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, user=Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    """
    Process AI Todo commands via chat:
    Commands supported:
    - add <task title>
    - list
    - complete <task title>
    - update <old title> to <new title>
    - delete <task title>
    """

    message = payload.message.strip().lower()

    # --- ADD TASK ---
    if message.startswith("add "):
        task_title = payload.message[4:].strip()
        if not task_title:
            return {"response": "❌ Task title cannot be empty."}

        task_data = TaskCreate(title=task_title, description="")
        task_response = await create_task(task_data, user_id=user["user_id"], current_user=user, session=session)
        return {"response": f"✅ Task added: {task_response.title}"}

    # --- LIST TASKS ---
    if "list" in message:
        tasks_list: List = await get_tasks(user_id=user["user_id"], current_user=user, session=session)
        if not tasks_list:
            return {"response": "📋 No tasks found."}
        response_text = "📋 Your Tasks:\n"
        for t in tasks_list:
            status = "✅" if t.is_completed else "❌"
            response_text += f"{status} {t.title}\n"
        return {"response": response_text}

    # --- COMPLETE TASK ---
    if message.startswith("complete "):
        task_title = payload.message[9:].strip()
        tasks_list: List = await get_tasks(user_id=user["user_id"], current_user=user, session=session)
        task = next((t for t in tasks_list if t.title.lower() == task_title.lower()), None)
        if not task:
            return {"response": f"❌ Task not found: {task_title}"}

        completion_data = TaskCompletionToggle(is_completed=True)
        updated_task = await toggle_task_completion(completion_data, user_id=user["user_id"], id=task.id, current_user=user, session=session)
        return {"response": f"✅ Task marked complete: {updated_task.title}"}

    # --- UPDATE TASK ---
    if message.startswith("update "):
        try:
            old_new = payload.message[7:].split(" to ")
            old_title = old_new[0].strip()
            new_title = old_new[1].strip()
        except:
            return {"response": "❌ Invalid update format. Use: update <old title> to <new title>"}

        tasks_list: List = await get_tasks(user_id=user["user_id"], current_user=user, session=session)
        task = next((t for t in tasks_list if t.title.lower() == old_title.lower()), None)
        if not task:
            return {"response": f"❌ Task not found: {old_title}"}

        update_data = TaskUpdate(title=new_title)
        updated_task = await update_task(update_data, user_id=user["user_id"], id=task.id, current_user=user, session=session)
        return {"response": f"✅ Task updated: {old_title} → {updated_task.title}"}

    # --- DELETE TASK ---
    if message.startswith("delete "):
        task_title = payload.message[7:].strip()
        tasks_list: List = await get_tasks(user_id=user["user_id"], current_user=user, session=session)
        task = next((t for t in tasks_list if t.title.lower() == task_title.lower()), None)
        if not task:
            return {"response": f"❌ Task not found: {task_title}"}

        await delete_task(user_id=user["user_id"], id=task.id, current_user=user, session=session)
        return {"response": f"🗑 Task deleted: {task_title}"}

    # --- DEFAULT RESPONSE ---
    return {"response": "❌ Command not recognized. Try: add, list, complete, update, delete."}
