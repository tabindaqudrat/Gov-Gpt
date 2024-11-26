'use server';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { documents, insertDocumentSchema } from '@/lib/db/schema/documents';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

// Helper function to detect section headers
function detectSection(content: string): string | null {
  // Common section header patterns
  const sectionPatterns = [
    /^#{1,6}\s+(.+)$/m,  // Markdown headers
    /^([A-Z][A-Za-z\s]{2,}:)/m,  // Capitalized words followed by colon
    /^(\d+\.\d*\s+[A-Z][A-Za-z\s]{2,})/m,  // Numbered sections
    /^([A-Z][A-Za-z\s]{2,})$/m,  // All-caps or Title Case lines
  ];

  for (const pattern of sectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

// Helper function to detect timestamps or dates
function detectTimestamp(content: string): string | null {
  // Common date/time patterns
  const datePatterns = [
    // ISO dates: 2024-03-21
    /\b(\d{4}-\d{2}-\d{2})\b/,
    // Common date formats: 21/03/2024, 03/21/2024
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
    // Written dates: March 21, 2024
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b/,
    // Times: 14:30:00, 2:30 PM
    /\b(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\b/
  ];

  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

interface ChunkMetadata {
  pageNumber: number;
  section: string | null;
  timestamp: string | null;
}

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
    const loader = new PDFLoader(blob, {
      splitPages: true,
      parsedItemSeparator: '\n',
    });
    
    const docs = await loader.load();
    
    // Use a more sophisticated text splitter
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 300,
      separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
      keepSeparator: true,
    });

    const chunks = await splitter.splitDocuments(docs);

    // Store the full document content
    const [document] = await db
      .insert(documents)
      .values({
        title,
        type,
        content: docs.map(d => d.pageContent).join('\n'),
        originalFileName: file.name,
      })
      .returning();

    // Process chunks with metadata
    const embeddingsArray = await Promise.all(
      chunks.map(chunk => generateEmbeddings({
        pageContent: chunk.pageContent,
        metadata: {
          pageNumber: chunk.metadata.pageNumber,
          section: detectSection(chunk.pageContent),
          timestamp: detectTimestamp(chunk.pageContent),
        } as ChunkMetadata
      }))
    );

    // Store embeddings with metadata
    await db.insert(embeddingsTable).values(
      embeddingsArray.flat().map(({ embedding, content, metadata }) => ({
        resourceId: document.id,
        embedding,
        content,
        metadata
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