import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { findRelevantContent } from '@/lib/ai/embedding';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Get relevant content for the last message
  const lastMessage = messages[messages.length - 1];
  const relevantContent = await findRelevantContent(lastMessage.content);

  // Format the content for the AI to use
  const contextString = relevantContent.map(content => {
    return `Document: ${content.documentTitle}
            Type: ${content.documentType}
            Content: ${content.content}
            ---`;
  }).join('\n\n');

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are Numainda, an AI assistant focused on Pakistan's constitutional and electoral information.
    
    Here is the relevant information from official documents to help answer the question:
    
    ${contextString}
    
    Instructions:
    1. Base your responses ONLY on the information provided above.
    2. If the provided information is not sufficient to answer the question fully, acknowledge what you know and what you don't.
    3. Always cite your sources by mentioning the specific document you're referencing.
    4. If no relevant information is found, respond with "I apologize, but I don't have enough information in my knowledge base to answer that question accurately."
    5. Be precise and factual - do not make assumptions or extrapolate beyond the provided information.
    6. If you find information from multiple documents, synthesize them coherently while citing each source.`,
  });

  return result.toDataStreamResponse();
}