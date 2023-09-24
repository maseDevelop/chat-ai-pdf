"use client";
import react from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type ProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export function Providers({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
