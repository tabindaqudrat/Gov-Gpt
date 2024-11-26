import { getProceedings } from '@/lib/proceedings'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function ProceedingsPage() {
  const proceedings = await getProceedings()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Parliamentary Proceedings</h1>
      <div className="space-y-4">
        {proceedings.map((proceeding) => (
          <Link 
            key={proceeding.id} 
            href={`/proceedings/${proceeding.id}`}
            className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{proceeding.title}</h2>
              <span className="text-gray-500">{format(new Date(proceeding.date), 'MMMM d, yyyy')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 