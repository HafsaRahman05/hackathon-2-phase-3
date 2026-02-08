// lib/chatbot.ts
import { api } from "./api";
import { authClient } from "./auth";

export async function handleUserCommand(command: string) {
  const user = authClient.getUserFromToken();
  if (!user) {
    return "❌ You must be signed in to manage tasks.";
  }

  try {
    if (command.startsWith("add ")) {
      const taskTitle = command.slice(4).trim();
      const newTask = await api.createTask(user.id, { title: taskTitle });
      return `✅ Task "${newTask.title}" added successfully! 🎉`;
    }

    if (command.startsWith("complete ")) {
      const taskId = parseInt(command.split(" ")[1]);
      const updatedTask = await api.toggleTaskCompletion(user.id, taskId, true);
      return `✅ Task "${updatedTask.title}" marked as completed!`;
    }

    if (command.startsWith("delete ")) {
      const taskId = parseInt(command.split(" ")[1]);
      await api.deleteTask(user.id, taskId);
      return `✅ Task deleted successfully!`;
    }

    return "❌ Unknown command. Try add, complete, or delete.";
  } catch (error: any) {
    console.error("❌ Chatbot error:", error.message);
    return `❌ Failed: ${error.message}`;
  }
}
