/**
 * New Survey Page
 *
 * Page for creating a new evaluation with wizard-style survey
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import SurveyWizard from '@/components/forms/SurveyWizard';

interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
  category?: string;
  options?: string;
  placeholder?: string;
  helpText?: string;
}

export default function NewSurveyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'setup' | 'survey'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Setup form state
  const [setupData, setSetupData] = useState({
    name: '',
    description: '',
    phase: 'before',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchQuestions();
    }
  }, [status, router]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch questions');
      }

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData.name.trim()) {
      setError('Please provide a name for this evaluation');
      return;
    }
    setError('');
    setStep('survey');
  };

  const handleSurveySubmit = async (responses: Record<string, string>) => {
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: setupData.name,
          description: setupData.description,
          phase: setupData.phase,
          responses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create evaluation');
      }

      // Redirect to dashboard on success
      router.push('/dashboard?created=true');
    } catch (err: any) {
      setError(err.message);
      throw err; // Re-throw to let the wizard handle it
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Evaluation</h1>
          <p className="text-gray-600 mt-2">
            {step === 'setup'
              ? 'Set up your evaluation before answering the survey questions'
              : 'Complete the survey questions'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === 'setup' ? (
          <Card title="Evaluation Setup">
            <form onSubmit={handleSetupSubmit}>
              <Input
                id="name"
                label="Evaluation Name"
                value={setupData.name}
                onChange={(e) =>
                  setSetupData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="e.g., Q1 2025 AI Adoption - Backend Team"
                helpText="Give this evaluation a descriptive name"
              />

              <TextArea
                id="description"
                label="Description (Optional)"
                value={setupData.description}
                onChange={(e) =>
                  setSetupData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Add any additional context or notes..."
                rows={3}
              />

              <Select
                id="phase"
                label="Evaluation Phase"
                value={setupData.phase}
                onChange={(e) =>
                  setSetupData((prev) => ({ ...prev, phase: e.target.value }))
                }
                options={[
                  { value: 'before', label: 'Before - Baseline Assessment' },
                  { value: 'after', label: 'After - Post-Implementation Assessment' },
                ]}
                required
                helpText="Select whether this is a before or after evaluation"
              />

              <Button type="submit" className="w-full">
                Continue to Survey
              </Button>
            </form>
          </Card>
        ) : (
          <>
            <div className="mb-4">
              <Button
                variant="secondary"
                onClick={() => setStep('setup')}
                className="text-sm"
              >
                ← Back to Setup
              </Button>
            </div>
            <SurveyWizard questions={questions} onSubmit={handleSurveySubmit} />
          </>
        )}
      </div>
    </Layout>
  );
}
