import { Button } from "@/components/ui/button";
import { ClerkLoading, UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { Loader2, LogInIcon } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

export default async function Home() {
  const { userId } = await auth();

  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
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
            {isAuth && <Button>Go to Chats</Button>}
          </div>
          <p className="mt-4 font-mono text-lg max-w-xl">
            Use <span className="text-primary font-bold">PdAI </span> to
            interact with your PDF data
          </p>
          <p className="font-mono mt-3 ">
            Millions of finance Professionals are already using this to
            understand financial reports and data
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
