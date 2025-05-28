"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, DollarSign, Home, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { useDashboardStore } from "@/lib/stores/dashboardStore";
import { EmptyState } from "@/components/empty-state";

export default function Dashboard({ inHouse }: { inHouse: boolean }) {
  const [open, setOpen] = useState(!inHouse);

  // Dummy handlers for demonstration
  const handleCreateHouse = () => {
    alert("House created! (implement logic)");
    setOpen(false);
  };

  const handleJoinHouse = () => {
    alert("Joined house! (implement logic)");
    setOpen(false);
  };

  // --- Your existing dashboard logic below ---
  const {
    user,
    house,
    members,
    chores,
    expenses,
    contributions,
    notes,
    loading,
  } = useDashboardStore();

  const currentUser = user;
  const upcomingChores = chores.filter((chore) => !chore.completed).slice(0, 3);
  const recentExpenses = expenses.slice(0, 3);
  const pinnedNotes = notes.filter((note) => note.is_pinned).slice(0, 2);

  const { totalOwed, totalOwing, netBalance } = useMemo(() => {
    if (!currentUser) {
      return { totalOwed: 0, totalOwing: 0, netBalance: 0 };
    }
    let owed = 0;
    let owing = 0;
    expenses.forEach((expense) => {
      if (expense.paid_by === currentUser.id) return;
      if (!expense.split_between.includes(currentUser.id)) return;
      const totalPeople = expense.split_between.length + 1;
      const share = expense.amount / totalPeople;
      const userContributions = contributions
        .filter(
          (c) => c.expense_id === expense.id && c.user_id === currentUser.id,
        )
        .reduce((sum, c) => sum + c.amount, 0);
      owed += Math.max(0, share - userContributions);
    });
    expenses.forEach((expense) => {
      if (expense.paid_by !== currentUser.id) return;
      expense.split_between.forEach((sharedUserId) => {
        const splitAmount = expense.amount / (expense.split_between.length + 1);
        const sharedUserContributions = contributions
          .filter(
            (c) => c.expense_id === expense.id && c.user_id === sharedUserId,
          )
          .reduce((sum, c) => sum + c.amount, 0);
        owing += Math.max(0, splitAmount - sharedUserContributions);
      });
    });
    return {
      totalOwed: owed,
      totalOwing: owing,
      netBalance: owing - owed,
    };
  }, [currentUser, expenses, contributions]);

  return (
    <>
      {/* Popup Modal for Create/Join House */}
      {open && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#111",
            color: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            minWidth: "340px",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <h2 style={{ marginBottom: "1rem" }}>Welcome!</h2>
            <p style={{ marginBottom: "2rem" }}>
              You need to join or create a house to continue.
            </p>
            <button
              style={{
                margin: "0.5rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                border: "none",
                background: "#fff",
                color: "#111",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={handleCreateHouse}
            >
              Create House
            </button>
            <button
              style={{
                margin: "0.5rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                border: "1px solid #fff",
                background: "#111",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.2s, color 0.2s"
              }}
              onClick={handleJoinHouse}
            >
              Join House
            </button>
          </div>
        </div>
      )}

      {/* --- Your existing dashboard UI below --- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {!loading ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.display_name || "Guest"}! Here&apos;s
                  what&apos;s happening in your house.
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-5 w-100" />
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user?.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.display_name}</p>
              <p className="text-sm text-muted-foreground">{house?.name}</p>
            </div>
          </div>
        </div>

        {/* ...rest of your dashboard code (cards, tabs, etc.)... */}
        {/* For brevity, not repeating the entire dashboard code block here, but keep all your existing JSX! */}
        {/* If you want the full code, just copy your existing dashboard JSX below this line. */}
      </div>
    </>
  );
}

// Helper functions
function getChoreVariant(dueDate: string) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return "destructive";
  if (diffDays <= 1) return "warning";
  return "outline";
}

function getChoreStatus(dueDate: string) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days`;
}