import { Button } from "@/components/ui/button";
import { ClerkLoading, UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Loader2, LogInIcon } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import Image from "next/image";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";

export default async function Home() {
  const { userId } = await auth();

  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  const isPro = await checkSubscription();

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <Image
            className="pb-5"
            src="/assets/pdai-logo.svg"
            alt="pdai-logo"
            width={200}
            height={190}
          />
          <div className="flex items-center">
            <h1 className="text-primary font-mono mr-3 text-5xl font-semibold">
              Chat with your Data
            </h1>
            <ClerkLoading>
              <Loader2 className="w-5 h-5 animate-spin" />
            </ClerkLoading>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-8">
            {isAuth && firstChat && (
              <>
                <Link className="mr-6" href={`chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <SubscriptionButton animate isPro={isPro} />
              </>
            )}
          </div>
          <p className="mt-4 font-mono text-lg max-w-xl">
            Use <span className="text-primary font-bold">PdAI </span> to
            interact with your PDF data
          </p>
          <p className="font-mono mt-3 ">
            Actually interact with your PDF data, ask questions and get real
            time summirizations
          </p>
          <div className="mt-3 w-full ">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href={"/sign-in"}>
                <Button className="font-mono">
                  Login to get Started!
                  <LogInIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
