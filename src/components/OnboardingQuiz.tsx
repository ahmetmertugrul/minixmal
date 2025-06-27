import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Target, Home, Heart, Sparkles } from 'lucide-react';
import { onboardingSteps } from '../data/onboardingQuestions';
import { OnboardingAnswer, OnboardingQuestion } from '../types/onboarding';

interface OnboardingQuizProps {
  onComplete: (answers: OnboardingAnswer[]) => Promise<void>;
  loading: boolean;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete, loading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.value;
  };

  const updateAnswer = (questionId: string, value: string | string[] | number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      const newAnswer = { questionId, value };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const isStepComplete = () => {
    const requiredQuestions = currentStepData.questions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const answer = getAnswer(q.id);
      if (q.type === 'multiple-choice') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderQuestion = (question: OnboardingQuestion) => {
    const answer = getAnswer(question.id);

    switch (question.type) {
      case 'single-choice':
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => updateAnswer(question.id, option)}
                className={`w-full p-3 sm:p-4 text-left rounded-2xl border-2 transition-all ${
                  answer === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm sm:text-base">{option}</span>
                  {answer === option && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
        const multiAnswer = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options?.map((option, index) => {
              const isSelected = multiAnswer.includes(option);
              return (
                <button
                  key={index}
                  onClick={() => {
                    const newAnswer = isSelected
                      ? multiAnswer.filter(a => a !== option)
                      : [...multiAnswer, option];
                    updateAnswer(question.id, newAnswer);
                  }}
                  className={`w-full p-3 sm:p-4 text-left rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm sm:text-base">{option}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'scale':
        const scaleValue = typeof answer === 'number' ? answer : 5;
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>{question.scaleLabels?.min}</span>
              <span>{question.scaleLabels?.max}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={question.scaleMin}
                max={question.scaleMax}
                value={scaleValue}
                onChange={(e) => updateAnswer(question.id, parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {Array.from({ length: (question.scaleMax || 10) - (question.scaleMin || 1) + 1 }, (_, i) => (
                  <span key={i}>{(question.scaleMin || 1) + i}</span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <span className="text-xl sm:text-2xl font-bold text-indigo-600">{scaleValue}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={typeof answer === 'string' ? answer : ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none h-24 sm:h-32 text-sm sm:text-base"
          />
        );

      default:
        return null;
    }
  };

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <Target className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 1: return <Home className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 2: return <Heart className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 3: return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <Target className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-white font-medium text-sm sm:text-base">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-white/80 text-xs sm:text-sm">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
            <div 
              className="bg-white rounded-full h-2 sm:h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              {getStepIcon(currentStep)}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              {currentStepData.description}
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6 sm:space-y-8">
            {currentStepData.questions.map((question) => (
              <div key={question.id} className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.description && (
                    <p className="text-gray-600 text-sm sm:text-base">{question.description}</p>
                  )}
                </div>
                {renderQuestion(question)}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 sm:mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete() || loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
              {!isLastStep && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              {isLastStep && loading && (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;