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
    })
    .from(embeddings)
    .leftJoin(documents, eq(embeddings.resourceId, documents.id))
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);

  return similarContent;
};