"use client";
import react from "react";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  MessageCircle,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import React from "react";

type ChatSideBarProps = {
  chats: DrizzleChat[];
  chatId: number;
};

export function ChatSideBar({ chats, chatId }: ChatSideBarProps) {
  const [isChatSidebarVisible, setIsChatSidebarVisible] = React.useState(true);
  const { user } = useUser();
  return isChatSidebarVisible ? (
    // flex child in parent component
    <div className="flex-[1] max-w-xs w-full h-screen p-4 text-gray-200 bg-gray-900">
      <div className="grid grid-cols-4 gap-2">
        <Link className="col-span-3 " href={"/"}>
          <Button className="w-full justify-items-start font-mono border-dashed hover:bg-blue-600 border-white border transition-transform transform hover:scale-105">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </Link>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsChatSidebarVisible(!isChatSidebarVisible)}
                className=" col-span-1 font-mono border-dashed hover:bg-blue-600 border-white border transition-transform transform hover:scale-105 "
              >
                <PanelLeftClose className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="ml-5 text-gray-200 bg-gray-900"
            >
              <p className="font-mono ">Close sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
      <div>
        <div className="flex flex-col items-center absolute bottom-11 border-t gap-4  ">
          <Link href={"/"}>
            <div className="flex flex-row items-center w-full text-xs font-mono border-dashed transition-transform transform hover:scale-110 hover:text-white pt-4">
              <User2 className="mr-2 w-4 h-4" />
              Upgrade to plus
            </div>
          </Link>
          <div className="flex flex-row items-center  ">
            <UserButton afterSignOutUrl="/" />{" "}
            {/* Include the UserButton component here */}
            <div className="ml-4 font-mono text-sm truncate">
              {user?.primaryEmailAddress?.toString() || "User"}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="absolute top-1 left-1 p-4 z-50">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PanelLeftClose
              onClick={() => setIsChatSidebarVisible(!isChatSidebarVisible)}
              className=" hover:cursor-pointer w-6 h-6"
            />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="mt-2 ml-5 text-gray-200 bg-gray-900"
          >
            <p className="font-mono ">Open sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
