import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { documents } from '../db/schema/documents';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export const generateEmbeddings = async (
  chunk: { pageContent: string; metadata: { pageNumber: number } }
): Promise<Array<{ embedding: number[]; content: string; metadata: any }>> => {
  const { embedding } = await embed({
    model: embeddingModel,
    value: chunk.pageContent,
  });
  
  return [{
    content: chunk.pageContent,
    embedding,
    metadata: chunk.metadata
  }];
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbeddings({
    pageContent: userQuery,
    metadata: { pageNumber: 1 }
  });
  
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded[0].embedding,
  )})`;
  
  // Join with documents table to get document context
  const similarContent = await db
    .select({ 
      content: embeddings.content,
      similarity,
      documentTitle: documents.title,
      documentType: documents.type,
      metadata: embeddings.metadata,
      // Add page number and section info if available
      pageNumber: sql<number>`(${embeddings.metadata}->>'pageNumber')::int`,
      section: sql<string>`${embeddings.metadata}->>'section'`,
    })
    .from(embeddings)
    .leftJoin(documents, eq(embeddings.resourceId, documents.id))
    .where(gt(similarity, 0.75)) // Increased similarity threshold
    .orderBy(desc(similarity))
    .limit(6); // Increased limit for more context

  // Debug log
  console.log('Found relevant content:', {
    query: userQuery,
    matches: similarContent.length,
    topSimilarity: similarContent[0]?.similarity,
  });

  return similarContent;
};