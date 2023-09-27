import { SignUp } from "@clerk/nextjs";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

export default function ChatPage({ params: { chatId } }: ChatPageProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
  );
}
