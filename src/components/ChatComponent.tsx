"use client";
import React from "react";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Input } from "./ui/input";
import { MessageList } from "./MessageList";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";

type ChatComponentProps = { chatId: string };

export function ChatComponent({ chatId }: ChatComponentProps) {
  console.log("chatId chat component", chatId);
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages, error } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="relative max-h-screen overflow-scroll overflow-x-hidden  scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold text-primary font-mono">Chat</h3>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Opps something went wrong</AlertDescription>
        </Alert>
      )}

      <MessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 pt-10 bg-white"
      >
        <div className="flex">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="w-full font-mono"
          />
          <Button className="hover:bg-secondary hover:text-primary bg-primary ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
