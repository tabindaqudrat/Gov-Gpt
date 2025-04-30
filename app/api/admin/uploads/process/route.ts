import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { db } from '@/lib/db';
import { documentUploads } from '@/lib/db/schema/document-uploads';
import { eq } from 'drizzle-orm';
import { uploadDocument } from '@/lib/actions/documents';

interface UploadMetadata {
  [key: string]: string;
}

async function handler(req: Request) {
  try {
    const { uploadId } = await req.json();
    
    // Update status to processing
    await db
      .update(documentUploads)
      .set({ 
        status: 'processing',
        processingProgress: 10,
        updatedAt: new Date()
      })
      .where(eq(documentUploads.id, uploadId));

    // Get upload details
    const [upload] = await db
      .select()
      .from(documentUploads)
      .where(eq(documentUploads.id, uploadId));

    if (!upload) {
      throw new Error('Upload not found');
    }

    try {
      // Fetch the file directly from S3 URL
      const fileResponse = await fetch(upload.fileUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from S3: ${fileResponse.statusText}`);
      }
      
      const fileBlob = await fileResponse.blob();
      const file = new File([fileBlob], upload.originalFileName, { type: 'application/pdf' });
      
      // Create form data with the file
      const formData = new FormData();
      formData.append('file', file);
      const metadata = upload.metadata as UploadMetadata;
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Process the document using existing logic
      const result = await uploadDocument(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Update upload status to completed
      await db
        .update(documentUploads)
        .set({ 
          status: 'completed',
          processingProgress: 100,
          documentId: result.document?.id,
          updatedAt: new Date()
        })
        .where(eq(documentUploads.id, uploadId));

    } catch (error) {
      // Update upload status to failed
      await db
        .update(documentUploads)
        .set({ 
          status: 'failed',
          error: (error as Error).message,
          updatedAt: new Date()
        })
        .where(eq(documentUploads.id, uploadId));
      
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureAppRouter(handler); 