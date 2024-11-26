import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { findRelevantContent } from '@/lib/ai/embedding';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Get relevant content for the last message
  const lastMessage = messages[messages.length - 1];
  const relevantContent = await findRelevantContent(lastMessage.content);

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are Numainda, an AI assistant focused on Pakistan's constitutional and electoral information.
    Base your responses on the following relevant information from official documents:
    ${relevantContent.map(c => c.name).join('\n\n')}
    
    If no relevant information is found, respond with "I apologize, but I don't have enough information to answer that question accurately."
    
    Always cite the specific document or section you're referencing in your responses.`,
  });

  return result.toDataStreamResponse();
}