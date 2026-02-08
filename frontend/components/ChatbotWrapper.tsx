"use client";
import { useAuth } from "./AuthProvider";

export default function ChatbotWrapper() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null; // user login nahi toh chatbot hide

  return (
    <div className="fixed bottom-4 right-4">
      {/* Aapka Chatbot UI */}
      <p>Chatbot Active</p>
    </div>
  );
}
