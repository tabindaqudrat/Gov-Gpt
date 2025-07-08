'use server';

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { documents, insertDocumentSchema } from '@/lib/db/schema/documents';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';
// import { createProceeding } from "../proceedings"; //
import { nanoid } from 'nanoid';
// import { bills, insertBillSchema } from '../db/schema/bills'; //

// Helper function to detect section headers
function detectSection(content: string): string | null {
  // Common section header patterns
  const sectionPatterns = [
    /^#{1,6}\s+(.+)$/m,  // Markdown headers
    /^([A-Z][A-Za-z\s]{2,}:)/m,  // Capitalized words followed by colon
    /^(\d+\.\d*\s+[A-Z][A-Za-z\s]{2,})/m,  // Numbered sections
    /^([A-Z][A-Za-z\s]{2,})$/m,  // All-caps or Title Case lines
    /^Rule\s+\d+[:\s]/m,          // Rule 12:
    /^Section\s+\d+[:\s]/m,       // Section 3:
    /^Part\s+[A-Z]+/m,            // Part IV
    /^Chapter\s+[A-Z]+/im,        // Chapter II (case-insensitive)
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

async function extractTextFromPDF(file: File): Promise<string> {
  const blob = new Blob([await file.arrayBuffer()]);
  const loader = new PDFLoader(blob, {
    splitPages: true,
    parsedItemSeparator: '\n',
  });
  
  const docs = await loader.load();
  return docs.map(d => d.pageContent).join('\n');
}

async function createDocument({ title, type, content, originalFileName }: {
  title: string;
  type: string;
  content: string;
  originalFileName: string;
}) {
  // Store the full document
  const [document] = await db
    .insert(documents)
    .values({
      title,
      type,
      content,
      originalFileName,
    })
    .returning();

  // Split content into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 300,
    separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    keepSeparator: true,
  });

  const chunks = await splitter.createDocuments([content]);

  // Process chunks in batches to avoid rate limits
  const batchSize = 5;
  const embeddingsArray = [];
  
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(chunks.length / batchSize)}`);
    
    const batchEmbeddings = await Promise.all(
      batch.map(chunk => generateEmbeddings({
        pageContent: chunk.pageContent,
        metadata: {
          pageNumber: chunk.metadata.pageNumber || 1,
          section: detectSection(chunk.pageContent),
          timestamp: detectTimestamp(chunk.pageContent),
        } as ChunkMetadata
      }))
    );
    
    embeddingsArray.push(...batchEmbeddings);
    
    // Add a small delay between batches to avoid rate limits
    if (i + batchSize < chunks.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Store embeddings with metadata
  await db.insert(embeddingsTable).values(
    embeddingsArray.flat().map(({ embedding, content, metadata }) => ({
      id: nanoid(),
      resourceId: document.id,
      embedding,
      content,
      metadata
    }))
  );

  return document;
}

export const uploadDocument = async (
  formData: FormData
): Promise<{ success: boolean; message: string; document?: any }> => {
  try {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const bulletinDate = formData.get('date') as string;
    
    console.log('Starting document upload:', { title, type, fileName: file.name });
    
    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const text = await extractTextFromPDF(file);
    console.log('Text extraction complete');

    // Create document first
    console.log('Creating document record...');
    const document = await createDocument({
      title,
      type,
      content: text,
      originalFileName: file.name,
    });
    console.log('Document record created:', document.id);

    // Handle different document types
    if (type === 'rules_policy') {
      console.log('Processing rules and policy document — no extra action needed.');
    } else if (type === 'citizen_services') {
      console.log('Processing citizen service document — no extra action needed.');
    } else {
      console.warn(`Unhandled document type: ${type} — skipping additional processing.`);
    }

    return {
      success: true,
      message: 'Document uploaded successfully',
      document
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      message: 'Error uploading document: ' + (error as Error).message
    };
  }
};

