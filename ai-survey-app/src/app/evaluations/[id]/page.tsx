/**
 * Evaluation Details Page
 *
 * Displays detailed view of a completed evaluation with all responses
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Response {
  questionId: string;
  questionText: string;
  questionCategory?: string;
  answer: string;
}

interface Evaluation {
  id: string;
  name: string;
  description?: string;
  phase: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  responses: Response[];
}

export default function EvaluationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchEvaluation();
    }
  }, [status, router, params.id]);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/evaluations/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch evaluation');
      }

      setEvaluation(data.evaluation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnswer = (answer: string): string | string[] => {
    try {
      return JSON.parse(answer);
    } catch {
      return answer;
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

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => router.push('/dashboard')} variant="secondary">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!evaluation) {
    return null;
  }

  // Group responses by category
  const groupedResponses: Record<string, Response[]> = {};
  evaluation.responses.forEach((response) => {
    const category = response.questionCategory || 'Other';
    if (!groupedResponses[category]) {
      groupedResponses[category] = [];
    }
    groupedResponses[category].push(response);
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{evaluation.name}</h1>
              {evaluation.description && (
                <p className="text-gray-600 mt-2">{evaluation.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span>Created: {new Date(evaluation.createdAt).toLocaleDateString()}</span>
                {evaluation.completedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Completed: {new Date(evaluation.completedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                evaluation.phase === 'before'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {evaluation.phase === 'before' ? 'Before' : 'After'}
            </span>
          </div>
        </div>

        {/* Responses by category */}
        {Object.entries(groupedResponses).map(([category, responses]) => (
          <Card key={category} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="space-y-6">
              {responses.map((response, index) => {
                const parsedAnswer = parseAnswer(response.answer);
                const isArray = Array.isArray(parsedAnswer);

                return (
                  <div
                    key={response.questionId}
                    className={index > 0 ? 'border-t border-gray-200 pt-6' : ''}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {response.questionText}
                    </h3>
                    {isArray ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {parsedAnswer.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{parsedAnswer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
