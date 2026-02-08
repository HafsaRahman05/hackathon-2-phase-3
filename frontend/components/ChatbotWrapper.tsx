"use client";

import { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatbotWrapper() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Login token localStorage se le rahe hain
    const t = localStorage.getItem("token");
    console.log("Token:", t);
    setToken(t);
  }, []);

  if (!token) return null; // Agar login nahi, to chatbot show nahi hoga

  return <ChatPanel token={token} />;
}
