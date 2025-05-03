'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

// Define the type for a bill
interface Bill {
  id: string;
  title: string;
  status: string;
  createdAt: string; // Assuming createdAt is a string, adjust if it's a Date object
}

export default function BillsPage() {
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/bills');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setAllBills(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">National Assembly Bills</h1>
      
      {loading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500">Error loading bills: {error}</p>
      )}

      {!loading && !error && (
        <div className="grid gap-4">
          {allBills.map((bill) => (
            <Link 
              key={bill.id} 
              href={`/bills/${bill.id}`}
              className="block p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2 tracking-tight">{bill.title}</h2>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${getStatusClassName(bill.status)}
                `}>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 