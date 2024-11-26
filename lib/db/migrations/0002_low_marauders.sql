ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_resource_id_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "metadata" jsonb NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_resource_id_documents_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
