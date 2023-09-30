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
import React from "react";

type ChatSideBarProps = {
  chats: DrizzleChat[];
  chatId: string;
};

export function ChatSideBar({ chats, chatId }: ChatSideBarProps) {
  const [isChatSidebarVisible, setIsChatSidebarVisible] = React.useState(true);
  const { user } = useUser();
  return isChatSidebarVisible ? (
    // flex child in parent component
    <div className="flex-[1] max-w-xs flex flex-col w-full h-screen pl-4 pt-4 text-gray-200 bg-primary ">
      <div className="grid grid-cols-4 gap-2 pr-4">
        <Link className="col-span-3 " href={"/"}>
          <Button className="w-full justify-items-start font-mono border-dashed hover:bg-secondary hover:text-primary  border-white border transition-transform transform hover:scale-105">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat
          </Button>
        </Link>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsChatSidebarVisible(!isChatSidebarVisible)}
                className=" col-span-1 font-mono border-dashed hover:bg-secondary hover:text-primary border-white border transition-transform transform hover:scale-105 "
              >
                <PanelLeftClose className="w-6 h-6 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="ml-5 text-gray-200 bg-primary"
            >
              <p className="font-mono ">Close sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex max-h-screen pb-20 flex-col gap-2 mt-4 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary">
        <div>
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-slate-300 flex items-center hover:bg-gray-800 border-white",
                  {
                    "bg-secondary text-primary": chat.id === chatId,
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
      </div>
      <div
        id="footer"
        className="border-t gap-4 mt-auto mr-4 bg-gray-900 h-35 "
      >
        <div className="flex flex-col items-center">
          <Link href={"/"}>
            <div className="pb-3 flex flex-row items-center w-full text-xs font-mono border-dashed transition-transform transform hover:scale-110 hover:text-white pt-4">
              <User2 className="mr-2 w-4 h-4" />
              Upgrade to plus
            </div>
          </Link>
          <div className="flex flex-row items-center mb-5 ">
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
    <div className="sticky p-4 z-50 flex flex-col items-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PanelLeftClose
              onClick={() => setIsChatSidebarVisible(!isChatSidebarVisible)}
              className="w-8 h-8 hover:cursor-pointer border-white border transition-transform transform hover:scale-105 "
            />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="mt-2 ml-5 text-gray-200 bg-primary"
          >
            <p className="font-mono ">Open sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="mt-2">
        <UserButton afterSignOutUrl="/" />{" "}
      </div>
    </div>
  );
}
