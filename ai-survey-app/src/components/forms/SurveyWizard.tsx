/**
 * SurveyWizard Component
 *
 * A wizard-style interface for completing surveys with:
 * - Multi-step navigation
 * - Progress tracking
 * - Form validation
 * - Dynamic question rendering
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import CheckboxGroup from '../ui/CheckboxGroup';
import Card from '../ui/Card';

/**
 * Question type definition
 */
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

interface SurveyWizardProps {
  questions: Question[];
  onSubmit: (responses: Record<string, string>) => Promise<void>;
  initialValues?: Record<string, string>;
}

/**
 * SurveyWizard component for multi-step survey completion
 */
export default function SurveyWizard({
  questions,
  onSubmit,
  initialValues = {},
}: SurveyWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  /**
   * Validate current question response
   */
  const validateCurrentStep = (): boolean => {
    const questionId = currentQuestion.id;
    const response = responses[questionId];

    if (currentQuestion.required && (!response || response.trim() === '')) {
      setErrors({ [questionId]: 'This field is required' });
      return false;
    }

    // For multiselect, check if it's an array with at least one item
    if (
      currentQuestion.type === 'multiselect' &&
      currentQuestion.required &&
      (!response || JSON.parse(response).length === 0)
    ) {
      setErrors({ [questionId]: 'Please select at least one option' });
      return false;
    }

    setErrors({});
    return true;
  };

  /**
   * Handle next button click
   */
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  /**
   * Handle previous button click
   */
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(responses);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle response change
   */
  const handleResponseChange = (questionId: string, value: string | string[]) => {
    const stringValue = Array.isArray(value) ? JSON.stringify(value) : value;
    setResponses((prev) => ({
      ...prev,
      [questionId]: stringValue,
    }));
    // Clear error for this field
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  /**
   * Render question input based on type
   */
  const renderQuestionInput = () => {
    const questionId = currentQuestion.id;
    const value = responses[questionId] || '';
    const error = errors[questionId];

    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            id={questionId}
            value={value}
            onChange={(e) => handleResponseChange(questionId, e.target.value)}
            placeholder={currentQuestion.placeholder}
            helpText={currentQuestion.helpText}
            error={error}
            required={currentQuestion.required}
          />
        );

      case 'textarea':
        return (
          <TextArea
            id={questionId}
            value={value}
            onChange={(e) => handleResponseChange(questionId, e.target.value)}
            placeholder={currentQuestion.placeholder}
            helpText={currentQuestion.helpText}
            error={error}
            required={currentQuestion.required}
            rows={6}
          />
        );

      case 'select':
        const selectOptions = currentQuestion.options
          ? JSON.parse(currentQuestion.options).map((opt: string) => ({
              value: opt,
              label: opt,
            }))
          : [];
        return (
          <Select
            id={questionId}
            value={value}
            onChange={(e) => handleResponseChange(questionId, e.target.value)}
            options={selectOptions}
            helpText={currentQuestion.helpText}
            error={error}
            required={currentQuestion.required}
          />
        );

      case 'multiselect':
        const checkboxOptions = currentQuestion.options
          ? JSON.parse(currentQuestion.options).map((opt: string) => ({
              value: opt,
              label: opt,
            }))
          : [];
        const selectedValues = value ? JSON.parse(value) : [];
        return (
          <CheckboxGroup
            options={checkboxOptions}
            value={selectedValues}
            onChange={(values) => handleResponseChange(questionId, values)}
            helpText={currentQuestion.helpText}
            error={error}
            required={currentQuestion.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category badge */}
      {currentQuestion.category && (
        <div className="mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full">
            {currentQuestion.category}
          </span>
        </div>
      )}

      {/* Question */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {currentQuestion.text}
          {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {renderQuestionInput()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handlePrevious} disabled={isSubmitting}>
              Previous
            </Button>
          )}
        </div>
        <div className="flex space-x-3">
          {!isLastStep ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Survey
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
