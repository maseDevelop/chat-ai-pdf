"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Loader2, PanelLeftClose, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

type SubscriptionButtonProps = {
  isPro: boolean;
  animate?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
};

export function SubscriptionButton({
  isPro,
  animate = false,
  disabled = false,
  iconOnly = false,
}: SubscriptionButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    if (disabled) return;
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return iconOnly ? (
    loading ? (
      <Loader2 className="animate-spin w-8 h-8" />
    ) : (
      <div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <User2
                onClick={handleSubscription}
                className="w-8 h-8 hover:cursor-pointer border-white border transition-transform transform hover:scale-105 "
              />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="mt-2 ml-5 text-gray-200 border-white bg-primary rounded-md"
            >
              <p className="font-mono p-1">
                {isPro ? "Manage Subscriptions" : "Upgrade to Plus"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  ) : (
    <div
      onClick={handleSubscription}
      className={cn("flex flex-row items-center text-xs font-mono ", {
        "transition-transform transform hover:scale-110 hover:text-white hover:cursor-pointer":
          !disabled,
        "text-gray-700 hover:cursor-not-allowed": disabled,
        "hover:text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 fill-indigo-500":
          animate,
      })}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <User2 className={"mr-2 w-4 h-4 "} />
          <p>{isPro ? "Manage Subscriptions" : "Upgrade to Plus"}</p>
        </>
      )}
    </div>
  );
}

export default SubscriptionButton;
