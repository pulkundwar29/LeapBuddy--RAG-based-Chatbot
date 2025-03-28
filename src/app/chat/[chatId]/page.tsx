import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
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

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex-none w-64 border-r border-gray-200 bg-white flex flex-col h-full">
        {/* Chat List Container */}
        <div className="flex-1 overflow-y-auto">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
      </div>
      {/* PDF Viewer */}
      <div className="flex-1 p-4 bg-gray-100 overflow-auto">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
      {/* Chat Component */}
      <div className="flex-1 border-l border-gray-200 bg-white overflow-auto">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  );
};

export default ChatPage;
