import { db } from '@/lib/db';
import { bills } from '@/lib/db/schema/bills';
import Link from 'next/link';
import { desc } from 'drizzle-orm';

export default async function BillsPage() {
  const allBills = await db.query.bills.findMany({
    orderBy: [desc(bills.createdAt)],
  });

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">National Assembly Bills</h1>
      
      <div className="grid gap-4">
        {allBills.map((bill) => (
          <Link 
            key={bill.id} 
            href={`/bills/${bill.id}`}
            className="block p-6 rounded-lg shadow transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{bill.title}</h2>
            <div className="flex gap-4 text-sm text-gray-600">
              {/* <span>Bill #{bill.billNumber}</span> */}
              {/* <span>Session #{bill.sessionNumber}</span> */}
              <span className={`
                px-2 py-1 rounded-full text-xs
                ${bill.status === 'passed' ? 'bg-green-100 text-green-800' : 
                  bill.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}
              `}>
                {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 