import { ChatSideBar } from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { SignUp, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PDFViewer } from "@/components/PDFViewer";
import { ChatComponent } from "@/components/ChatComponent";
import { checkSubscription } from "@/lib/subscription";

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

  if (!_chats.find((chat) => chat.id === chatId)) {
    return redirect("/");
  }

  // Get current chat
  const currentChat = _chats.find((chat) => chat.id === chatId);

  //Check the subscription user has
  const isPro = await checkSubscription();

  return (
    <div id="this-it" className="flex max-h-screen">
      <div className="flex w-full max-h-screen">
        {/* Chat Sidebar */}
        <ChatSideBar chats={_chats} chatId={chatId} isPro={isPro} />
        {/* PDF Viewer */}
        <div className="max-h-screen min-h-screen p-4 border border-gray-800 overflow-scroll flex-[5] ">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* Chat Component */}
        <div className="flex-[3] border-l-4 border-l-slate-200 ">
          <ChatComponent chatId={chatId} />
        </div>
      </div>
    </div>
  );
}
