import { ChatSideBar } from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { SignUp, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

// Server Component
export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { userId } = await auth();

  console.log("who are you ");

  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* Chat Sidebar */}
        <div className="flex-[1] max-w-xs">
          {<ChatSideBar chats={_chats} chatId={parseInt(chatId)} />}
        </div>
        {/* PDF Viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          {/* <PDFViewer/> */}
        </div>
        {/* Chat Component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/* <ChatComponent/> */}
        </div>
      </div>
    </div>
  );
}
