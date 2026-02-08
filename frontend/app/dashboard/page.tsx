"use client";

/**
 * Dashboard Page Component.
 *
 * Protected route that provides:
 * - Auth check
 * - Task management
 * - AI Chatbot (Phase 3)
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import ChatPanel from "@/components/ChatPanel";
import { authClient } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTaskList, setShowTaskList] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleTaskCreated = () => {
    setShowCreateForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTaskUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50 px-4 py-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/60 rounded-3xl shadow-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-2 bg-purple-600 text-white rounded-full"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Create Task */}
        <div>
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-full"
            >
              + Create New Task
            </button>
          ) : (
            <div className="bg-white/60 rounded-3xl p-6 shadow-xl">
              <TaskForm
                userId={user.id}
                onSuccess={handleTaskCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="bg-white/60 rounded-3xl shadow-xl">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <button
              onClick={() => setShowTaskList(!showTaskList)}
              className="px-4 py-2 bg-purple-600 text-white rounded-full"
            >
              {showTaskList ? "Hide Tasks" : "View Tasks"}
            </button>
          </div>

          {showTaskList && (
            <TaskList
              userId={user.id}
              refreshTrigger={refreshTrigger}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </div>
      </main>

      {/* ✅ AI CHATBOT – PHASE 3 */}
      <ChatPanel token={authClient.getToken()} />
    </div>
  );
}
