'use server';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { documents, insertDocumentSchema } from '@/lib/db/schema/documents';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const uploadDocument = async (
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;

    if (!file || !type || !title) {
      return { 
        success: false, 
        message: 'Missing required fields' 
      };
    }

    // Load and parse PDF
    const blob = new Blob([await file.arrayBuffer()]);
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    
    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    // Insert document metadata
    const [document] = await db
      .insert(documents)
      .values({
        title,
        type,
        content: chunks.map(c => c.pageContent).join('\n'),
        originalFileName: file.name,
      })
      .returning();

    // Generate and store embeddings for each chunk
    const embeddingsArray = await Promise.all(
      chunks.map(chunk => generateEmbeddings(chunk.pageContent))
    );

    // Flatten and store embeddings
    await db.insert(embeddingsTable).values(
      embeddingsArray.flat().map(embedding => ({
        resource_id: document.id,
        ...embedding,
      }))
    );

    return {
      success: true,
      message: 'Document successfully uploaded and processed'
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};