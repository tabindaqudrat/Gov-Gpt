import { generateId } from 'ai';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { documents } from './documents';

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => generateId()),
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => documents.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);