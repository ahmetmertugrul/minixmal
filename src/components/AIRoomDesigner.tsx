import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Wand2, 
  Download, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Loader2,
  Zap,
  Crown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';

interface AnalysisResult {
  beforeImage: string;
  afterImage: string;
  checklist: ChecklistItem[];
  analysisComplete: boolean;
  roomDescription?: string;
  architecturalInventory?: string;
  imagePrompt?: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedTime: string;
  reason?: string;
}

interface ProcessingStage {
  stage: 'analyzing' | 'planning' | 'transforming' | 'complete';
  message: string;
  progress: number;
}

const AIRoomDesigner: React.FC = () => {
  const { getCreditsRemaining, canUseAIDesigner, useCredit, isAdmin } = useSubscription();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>({
    stage: 'analyzing',
    message: 'Preparing analysis...',
    progress: 0
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const creditsRemaining = getCreditsRemaining();
  const canUseAI = canUseAIDesigner();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToSupabase = async (imageDataUrl: string): Promise<string> => {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    // Generate unique filename
    const fileName = `room-${Date.now()}.jpg`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('room-images')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('room-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const runAIAnalysis = async () => {
    if (!uploadedImage) return;

    // Check if user can use AI Designer
    if (!canUseAI) {
      setError('You need a Pro subscription with available credits to use the AI Room Designer.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Use a credit before starting analysis
      const creditUsed = await useCredit();
      if (!creditUsed && !isAdmin) {
        setError('Unable to use credit. Please check your subscription status.');
        setIsAnalyzing(false);
        return;
      }

      // Stage 1: Upload image
      setProcessingStage({
        stage: 'analyzing',
        message: 'Uploading image...',
        progress: 10
      });

      const imageUrl = await uploadImageToSupabase(uploadedImage);

      // Stage 2: AI Analysis
      setProcessingStage({
        stage: 'analyzing',
        message: 'AI analyzing architectural elements and room layout...',
        progress: 25
      });

      // Stage 3: Planning
      setProcessingStage({
        stage: 'planning',
        message: 'Creating minimalist plan while preserving room character...',
        progress: 50
      });

      // Stage 4: Transforming
      setProcessingStage({
        stage: 'transforming',
        message: 'Generating consistent minimalist transformation...',
        progress: 75
      });

      // Call the Supabase Edge Function with improved error handling
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-room-transform`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        }
      );

      // Check if the response is ok
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            
            // Provide specific guidance for common configuration issues
            if (errorMessage.includes('Nebius API key not configured')) {
              errorMessage = 'AI service not configured. Please contact support to enable AI room transformation features.';
            } else if (errorMessage.includes('NEBIUS_API_KEY')) {
              errorMessage = 'AI service configuration error. Please contact support for assistance.';
            }
          }
          if (errorData.details) {
            console.error('Edge Function Error Details:', errorData.details);
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          console.error('Failed to parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        throw new Error('Invalid response from AI service. Please try again.');
      }

      // Validate the response structure
      if (!result.transformedImageUrl || !result.checklist) {
        console.error('Invalid response structure:', result);
        throw new Error('Incomplete response from AI service. Please try again.');
      }

      // Stage 5: Complete
      setProcessingStage({
        stage: 'complete',
        message: 'AI transformation complete!',
        progress: 100
      });

      // Set results
      setAnalysisResult({
        beforeImage: uploadedImage,
        afterImage: result.transformedImageUrl,
        checklist: result.checklist,
        analysisComplete: true,
        roomDescription: result.roomDescription,
        architecturalInventory: result.architecturalInventory,
        imagePrompt: result.imagePrompt
      });
      
      setChecklist(result.checklist);

    } catch (err) {
      console.error('AI Analysis Error:', err);
      
      // Provide user-friendly error messages
      let userMessage = 'An unexpected error occurred while analyzing your room.';
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        userMessage = 'Unable to connect to AI service. Please check your internet connection and try again.';
      } else if (err instanceof Error) {
        userMessage = err.message;
      }
      
      setError(userMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Decluttering': return <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Organization': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Styling': return <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing': return <Camera className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'planning': return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'transforming': return <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'complete': return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <Loader2 className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Credits */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">AI Room Designer</h2>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-4">
          Upload a photo of your room and let our AI transform it into a minimalist sanctuary. 
          Get personalized recommendations and a step-by-step action plan.
        </p>
        
        {/* Credits Display */}
        <div className="flex justify-center">
          <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-2xl backdrop-blur-sm border ${
            isAdmin 
              ? 'bg-purple-600/20 border-purple-400 text-purple-100'
              : canUseAI 
              ? 'bg-green-600/20 border-green-400 text-green-100' 
              : 'bg-red-600/20 border-red-400 text-red-100'
          }`}>
            {isAdmin ? (
              <>
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Unlimited Credits (Admin)</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span className="font-semibold">
                  {creditsRemaining} Design Credits Remaining
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* No Credits Warning */}
      {!canUseAI && !isAdmin && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-orange-900 mb-2">No Design Credits Available</h3>
          <p className="text-orange-700 mb-4">
            You need a Pro subscription with available design credits to use the AI Room Designer.
          </p>
          <button
            onClick={() => window.location.href = '#pricing'}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Upload Section */}
      {!uploadedImage && canUseAI && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upload Your Room Photo</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Drag and drop an image here, or click to browse your files
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto text-sm sm:text-base">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Choose Photo</span>
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              Supports JPG, PNG, and WebP formats • Uses 1 design credit
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-1">Analysis Failed</h3>
              <p className="text-red-700 text-sm sm:text-base mb-3">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setError(null)}
                  className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setError(null);
                    setAnalysisResult(null);
                    setChecklist([]);
                  }}
                  className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Upload Different Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Image Preview */}
      {uploadedImage && !analysisResult && !isAnalyzing && canUseAI && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Your Room Photo</h3>
            <button
              onClick={() => {
                setUploadedImage(null);
                setAnalysisResult(null);
                setChecklist([]);
                setError(null);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-gray-100">
            <img 
              src={uploadedImage} 
              alt="Uploaded room" 
              className="w-full h-auto max-h-[600px] object-contain mx-auto block"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={runAIAnalysis}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-3 text-sm sm:text-base"
            >
              <Wand2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Transform with AI (1 Credit)</span>
            </button>
          </div>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            {getStageIcon(processingStage.stage)}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">AI Pipeline Processing</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {processingStage.message}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-3 sm:mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-1000"
              style={{ width: `${processingStage.progress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {processingStage.progress}% complete
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6 sm:space-y-8">
          {/* Before and After */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">AI Transformation</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Before */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">Before</h4>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                  <img 
                    src={analysisResult.beforeImage} 
                    alt="Before transformation" 
                    className="w-full h-auto max-h-[400px] object-contain mx-auto block"
                  />
                </div>
              </div>

              {/* After */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">After</h4>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                  <img 
                    src={analysisResult.afterImage} 
                    alt="After transformation" 
                    className="w-full h-auto max-h-[400px] object-contain mx-auto block"
                  />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Minimalist
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <a
                href={analysisResult.afterImage}
                download="minimalist-room-transformation.jpg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center space-x-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Download Transformation</span>
              </a>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Transformation Progress</h3>
              <span className="text-xs sm:text-sm text-gray-600">
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>

          {/* Action Checklist */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Your Action Plan</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {item.completed && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium text-sm sm:text-base ${
                          item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {item.task}
                        </p>
                        {item.reason && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.reason}</p>
                        )}
                        <div className="flex items-center space-x-2 sm:space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-xs sm:text-sm text-gray-600">{item.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            <span className="text-xs sm:text-sm text-gray-600">{item.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysisResult(null);
                  setChecklist([]);
                  setError(null);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto text-sm sm:text-base"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Analyze Another Room</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRoomDesigner;