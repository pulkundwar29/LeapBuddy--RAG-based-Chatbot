"use client";
import { DrizzleChat } from "@/lib/db/schema";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-full min-h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">
      {/* "Create New Chat" button */}
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          Create New Chat
        </Button>
      </Link>

      {/* Chat list */}
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-400 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-1 flex justify-center items-center h-12">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          Back To Homepage
        </Button>
      </Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
