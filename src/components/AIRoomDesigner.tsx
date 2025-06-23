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
  Trash2
} from 'lucide-react';

interface AnalysisResult {
  beforeImage: string;
  afterImage: string;
  checklist: ChecklistItem[];
  analysisComplete: boolean;
}

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  estimatedTime: string;
}

const AIRoomDesigner: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockChecklist: ChecklistItem[] = [
      {
        id: '1',
        task: 'Remove pile of clothes from the chair',
        category: 'Decluttering',
        priority: 'high',
        completed: false,
        estimatedTime: '10 min'
      },
      {
        id: '2',
        task: 'Organize books on the shelf by category',
        category: 'Organization',
        priority: 'medium',
        completed: false,
        estimatedTime: '20 min'
      },
      {
        id: '3',
        task: 'Clear nightstand surface, keep only essentials',
        category: 'Decluttering',
        priority: 'high',
        completed: false,
        estimatedTime: '15 min'
      },
      {
        id: '4',
        task: 'Store electronics cables in drawer organizer',
        category: 'Organization',
        priority: 'medium',
        completed: false,
        estimatedTime: '5 min'
      },
      {
        id: '5',
        task: 'Replace multiple decorative items with one statement piece',
        category: 'Styling',
        priority: 'low',
        completed: false,
        estimatedTime: '30 min'
      },
      {
        id: '6',
        task: 'Make bed with minimal, neutral bedding',
        category: 'Styling',
        priority: 'medium',
        completed: false,
        estimatedTime: '5 min'
      },
      {
        id: '7',
        task: 'Remove excess throw pillows, keep 1-2 maximum',
        category: 'Decluttering',
        priority: 'low',
        completed: false,
        estimatedTime: '2 min'
      },
      {
        id: '8',
        task: 'Create designated space for daily items (keys, wallet)',
        category: 'Organization',
        priority: 'medium',
        completed: false,
        estimatedTime: '10 min'
      }
    ];

    setAnalysisResult({
      beforeImage: uploadedImage!,
      afterImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', // Mock minimalist room
      checklist: mockChecklist,
      analysisComplete: true
    });
    
    setChecklist(mockChecklist);
    setIsAnalyzing(false);
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
      case 'Decluttering': return <Trash2 className="w-4 h-4" />;
      case 'Organization': return <CheckCircle className="w-4 h-4" />;
      case 'Styling': return <Sparkles className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">AI Room Designer</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Upload a photo of your room and let our AI transform it into a minimalist sanctuary. 
          Get personalized recommendations and a step-by-step action plan.
        </p>
      </div>

      {/* Upload Section */}
      {!uploadedImage && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Room Photo</h3>
            <p className="text-gray-600 mb-6">
              Drag and drop an image here, or click to browse your files
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto">
              <Upload className="w-5 h-5" />
              <span>Choose Photo</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Supports JPG, PNG, and WebP formats
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

      {/* Uploaded Image Preview */}
      {uploadedImage && !analysisResult && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Your Room Photo</h3>
            <button
              onClick={() => {
                setUploadedImage(null);
                setAnalysisResult(null);
                setChecklist([]);
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <img 
              src={uploadedImage} 
              alt="Uploaded room" 
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={simulateAIAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-3 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Analyzing Room...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  <span>Transform with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Loading */}
      {isAnalyzing && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">AI is Working Its Magic</h3>
          <p className="text-gray-600 mb-6">
            Analyzing your room and creating a personalized minimalist transformation plan...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-8">
          {/* Before and After */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Before & After Transformation</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Before</h4>
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={analysisResult.beforeImage} 
                    alt="Before transformation" 
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-semibold text-gray-900">After (AI Vision)</h4>
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src={analysisResult.afterImage} 
                    alt="After transformation" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Minimalist
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto">
                <Download className="w-5 h-5" />
                <span>Download Transformation</span>
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Transformation Progress</h3>
              <span className="text-sm text-gray-600">
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {progressPercentage.toFixed(0)}% complete
            </p>
          </div>

          {/* Action Checklist */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">Your Action Plan</h3>
            </div>
            
            <div className="space-y-4">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${
                          item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {item.task}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-sm text-gray-600">{item.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{item.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysisResult(null);
                  setChecklist([]);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
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