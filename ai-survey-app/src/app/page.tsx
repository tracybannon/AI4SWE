/**
 * Homepage
 *
 * Landing page for the AI Adoption Survey application
 */

import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Adoption Survey for Software Development
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Assess and track the impact of AI-augmented tools across your software development lifecycle
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Features section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-primary-600"
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
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Before & After Evaluations
                </h3>
                <p className="text-gray-600">
                  Capture baseline metrics before implementing AI tools and measure improvements
                  after adoption.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Configurable Questions
                </h3>
                <p className="text-gray-600">
                  Dynamic survey questions that can be updated over time without affecting existing
                  data.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enterprise Security
                </h3>
                <p className="text-gray-600">
                  Built with security best practices including encrypted authentication, input
                  validation, and comprehensive logging.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Multiple Evaluations
                </h3>
                <p className="text-gray-600">
                  Create and manage multiple evaluation sessions for different teams or projects.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* How it works section */}
        <Card className="bg-primary-50 border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full font-semibold mr-4">
                1
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">Create an Account</h4>
                <p className="text-gray-700">Register and create your profile to get started.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full font-semibold mr-4">
                2
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">Complete Before Evaluation</h4>
                <p className="text-gray-700">
                  Answer questions about your current state before adopting AI tools.
                </p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full font-semibold mr-4">
                3
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">Implement AI Tools</h4>
                <p className="text-gray-700">
                  Use AI-augmented tools in your development workflow.
                </p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-600 text-white rounded-full font-semibold mr-4">
                4
              </span>
              <div>
                <h4 className="font-semibold text-gray-900">Complete After Evaluation</h4>
                <p className="text-gray-700">
                  Assess the impact and measure improvements in your development process.
                </p>
              </div>
            </li>
          </ol>
        </Card>
      </div>
    </Layout>
  );
}
