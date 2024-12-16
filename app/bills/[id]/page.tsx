import { db } from '@/lib/db';
import { bills } from '@/lib/db/schema/bills';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'

export default async function BillPage({ params }: { params: { id: string } }) {
  const [bill] = await db
    .select()
    .from(bills)
    .where(eq(bills.id, params.id));

  if (!bill) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{bill.title}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* <div>
            <p className="text-sm text-gray-600">Bill Number</p>
            <p className="font-medium">{bill.billNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Session Number</p>
            <p className="font-medium">{bill.sessionNumber}</p>
          </div> */}
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`
              inline-block px-2 py-1 rounded-full text-sm
              ${bill.status === 'passed' ? 'bg-green-100 text-green-800' : 
                bill.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}
            `}>
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
            </p>
          </div>
          {bill.passageDate && (
            <div>
              <p className="text-sm text-gray-600">Passage Date</p>
              <p className="font-medium">
                {new Date(bill.passageDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="whitespace-pre-wrap"><ReactMarkdown>{bill.summary}</ReactMarkdown></div>
        </div>
      </div>
    </div>
  );
} 