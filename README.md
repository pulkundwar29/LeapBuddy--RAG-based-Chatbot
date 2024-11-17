# LeapBuddy: RAG-based Chat Assistant for New Leap Labs

![LeapBuddy](LeapBuddy.png)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm i --legacy-peer-deps
```

Then, run the development server:
```bash
npm run dev
```
Then, acquire API keys for the following purposes:
```bash
# Clerk Auth:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY

# NeonDB: 
DATABASE_URL
DATABASE_HOST
DATABASE_PASS
DATABASE_USER
DATABASE_NAME
DATABASE_PORT

# AWS S3: 
NEXT_PUBLIC_S3_ACCESS_KEY_ID
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
NEXT_PUBLIC_S3_BUCKET_NAME

# Pinecone: 
PINECONE_ENVIRONMENT
PINECONE_API_KEY

# Gemini: 
GEMINI_API_KEY
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



