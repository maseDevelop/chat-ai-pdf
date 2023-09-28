"use client";
import react from "react";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClerkLoading, UserButton, useUser } from "@clerk/nextjs";

type ChatSideBarProps = {
  chats: DrizzleChat[];
  chatId: number;
};

export function ChatSideBar({ chats, chatId }: ChatSideBarProps) {
  const { user } = useUser();
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href={"/"}>
        <Button className="w-full font-mono border-dashed hover:bg-blue-600 border-white border transition-transform transform hover:scale-105 ">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex max-h-screen pb-20 flex-col gap-2 mt-4 overflow-x-hidden overflow-y-auto">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn(
                "rounded-lg p-3 text-slate-300 flex items-center hover:bg-gray-800 border-white",
                {
                  "bg-blue-600 text-white": chat.id === chatId,
                  "hover:text-white ": chat.id !== chatId,
                }
              )}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis font-mono">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-row w-full items-center absolute bottom-10 pt-5">
        <UserButton afterSignOutUrl="/" />{" "}
        {/* Include the UserButton component here */}
        <div className="ml-4 font-mono text-md truncate">
          {`Hello ${user?.firstName}`}
        </div>
      </div>
    </div>
  );
}
