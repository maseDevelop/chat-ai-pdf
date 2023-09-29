import { ChatSideBar } from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { SignUp, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PDFViewer } from "@/components/PDFViewer";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

// Server Component
export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { userId } = await auth();

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

  // Get current chat
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen overflow-scroll overflow-y-hidden">
      <div className="flex w-full max-h-screen">
        {/* Chat Sidebar */}
        <div className="">
          {<ChatSideBar chats={_chats} chatId={parseInt(chatId)} />}
        </div>
        {/* PDF Viewer */}
        <div className="max-h-screen p-4  overflow-scroll flex-[5] ">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* Chat Component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/* <ChatComponent/> */}
        </div>
      </div>
    </div>
  );
}
