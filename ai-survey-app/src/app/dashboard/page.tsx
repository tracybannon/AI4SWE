/**
 * Dashboard Page
 *
 * User dashboard displaying all evaluations
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Evaluation {
  id: string;
  name: string;
  description?: string;
  phase: string;
  status: string;
  responseCount: number;
  createdAt: string;
  completedAt?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvaluations();
    }
  }, [status, router]);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/evaluations');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch evaluations');
      }

      setEvaluations(data.evaluations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const beforeEvaluations = evaluations.filter((e) => e.phase === 'before');
  const afterEvaluations = evaluations.filter((e) => e.phase === 'after');

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <Link href="/survey/new">
            <Button>New Evaluation</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {evaluations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No evaluations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first evaluation.
            </p>
            <div className="mt-6">
              <Link href="/survey/new">
                <Button>Create Evaluation</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Before Evaluations */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Before Evaluations ({beforeEvaluations.length})
            </h2>
            <div className="space-y-4">
              {beforeEvaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {evaluation.name}
                      </h3>
                      {evaluation.description && (
                        <p className="text-gray-600 text-sm mt-1">{evaluation.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{evaluation.responseCount} responses</span>
                        <span>•</span>
                        <span>{new Date(evaluation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Before
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/evaluations/${evaluation.id}`}>
                      <Button variant="secondary" className="text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* After Evaluations */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              After Evaluations ({afterEvaluations.length})
            </h2>
            <div className="space-y-4">
              {afterEvaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {evaluation.name}
                      </h3>
                      {evaluation.description && (
                        <p className="text-gray-600 text-sm mt-1">{evaluation.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{evaluation.responseCount} responses</span>
                        <span>•</span>
                        <span>{new Date(evaluation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      After
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/evaluations/${evaluation.id}`}>
                      <Button variant="secondary" className="text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
