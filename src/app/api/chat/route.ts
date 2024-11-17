import {GoogleGenerativeAI,} from "@google/generative-ai";
import { GoogleGenerativeAIStream,StreamingTextResponse } from "ai";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";

export const runtime="edge";

const genai= new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req:Request){
    try {
        const {messages, chatId}=await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        if (_chats.length != 1) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
          }
        const fileKey = _chats[0].fileKey;
        const lastMessage = messages[messages.length - 1];
        const context = await getContext(lastMessage.content, fileKey);
        console.log(`${context}`);
        
        let prompt=`
        Your name is LeapBuddy.
        You are a Retrieval Augmented Generation (RAG) based chatbot, which retrieves information from pdfs uploaded by user.
        You are in a conversation with a user who has uploaded a pdf file.
        The user has asked you to ${lastMessage.content}.
        You need to refer the pdf and retrieve the most relevant knowledge from it, and combine it with your global knowledge, to frame a suitable answer fro the user's question.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        START HISTORY BLOCK`
        for(let i=0;i<messages.length-1;i++){
            prompt+=`${messages[i].role}: ${messages[i].content}\n`;
        }
        prompt+=`END OF HISTORY BLOCK
        Respond to this considering given history:${lastMessage.content}\n`;
            
        const generationConfig = {
            temperature: 0.5,
            topK: 3,
            maxOutputTokens:5000,
        };
        const response=await genai
            .getGenerativeModel({model:"gemini-pro",generationConfig})
            .generateContentStream(prompt);
        const stream=GoogleGenerativeAIStream(response, {
            onStart: async () => {
                await db.insert(_messages).values({
                    chatId,
                    content: lastMessage.content,
                    role:'user',
                });
            },
            onCompletion: async (completion) =>{
                await db.insert(_messages).values({
                  chatId,
                  content: completion,
                  role: 'system',
                });
            },
        });
         console.log(prompt)
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error(error)
    }
}