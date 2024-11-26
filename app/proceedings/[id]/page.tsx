import { Button } from '@/components/ui/button'
import { getProceeding } from '@/lib/proceedings'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft } from 'lucide-react'

export default async function ProceedingPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const proceeding = await getProceeding(id)
  
  if (!proceeding) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/proceedings" className="flex items-center gap-2 mb-6">
          <ArrowLeft className="size-4" />
        </Link>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{proceeding.title}</h1>
          <p>{format(new Date(proceeding.date), 'MMMM d, yyyy')}</p>
        </div>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <ReactMarkdown>{proceeding.summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
} 