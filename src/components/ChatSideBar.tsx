"use client";
import react from "react";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

type ChatSideBarProps = {
  chats: DrizzleChat[];
  chatId: number;
};

export function ChatSideBar({ chats, chatId }: ChatSideBarProps) {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href={"/"}>
        <Button className="w-full border-dashed hover:bg-blue-600 border-white border transition-transform transform hover:scale-105 ">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>
    </div>
  );
}
