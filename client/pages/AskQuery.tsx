import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Upload, 
  Mic, 
  MicOff, 
  Camera, 
  MessageSquare, 
  Send,
  FileImage,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";
import { querySchema } from "@/lib/validation/schemas";
import { useFarmerStore } from "@/store/farmerStore";
import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type QueryFormData = z.infer<typeof querySchema>;

const AskQuery = () => {
  const navigate = useNavigate();
  const { profile, addQuery, queries } = useFarmerStore();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [queryType, setQueryType] = useState<'text' | 'image' | 'voice'>('text');
  const [historyFilter, setHistoryFilter] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      type: 'text',
      category: 'general',
      content: ''
    }
  });

  const watchedType = watch('type');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or WebP image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setQueryType('image');
      setValue('type', 'image');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (watchedType === 'image') {
      setQueryType('text');
      setValue('type', 'text');
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording logic would go here
      setIsRecording(true);
      setQueryType('voice');
      setValue('type', 'voice');
      toast.info('Voice recording started. Speak your query clearly.');
      
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        toast.success('Voice recording completed!');
      }, 3000);
    } else {
      setIsRecording(false);
      toast.success('Voice recording stopped');
    }
  };

  const onSubmit = async (data: QueryFormData) => {
  try {
    const formData = new FormData();
    formData.append("farmerId", profile?.id || "anonymous");
    formData.append("type", data.type);
    formData.append("content", data.content);
    formData.append("category", data.category);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Use relative path so Vite dev proxy forwards to backend
    const res = await fetch("/api/query", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.statusText}`);
    }

    const result = await res.json();

    const queryId = result?.id || result?.data?.id || Date.now().toString();

    // Save to Zustand store
    addQuery({
      farmerId: profile?.id || "anonymous",
      type: data.type,
      content: data.content,
      category: data.category,
      status: "pending",
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    });

    toast.success("✅ Query submitted successfully!");
    reset();
    setSelectedImage(null);
    setQueryType("text");

    navigate(`/advisory/${queryId}`);
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to submit query. Please try again.");
  }
};


  const queryTypeOptions = [
    { value: 'text', icon: MessageSquare, label: 'Text Query', description: 'Type your question' },
    { value: 'image', icon: Camera, label: 'Image Analysis', description: 'Upload crop/pest photo' },
    { value: 'voice', icon: Mic, label: 'Voice Message', description: 'Record your query' },
  ];

  const categories = [
    { value: 'pest', label: 'Pest Control', color: 'bg-red-100 text-red-700' },
    { value: 'disease', label: 'Plant Disease', color: 'bg-orange-100 text-orange-700' },
    { value: 'weather', label: 'Weather Advice', color: 'bg-blue-100 text-blue-700' },
    { value: 'fertilizer', label: 'Fertilizer Guidance', color: 'bg-green-100 text-green-700' },
    { value: 'general', label: 'General Query', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="min-h-screen animate-page-fade relative bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), url('https://cdn.builder.io/api/v1/image/assets%2Fe4d9b4c321534c40bd6f6f346837f286%2F85c8736a273545678a22ae9ac029800c?format=webp&width=1600')` }}>
      <div className="container mx-auto px-4 py-12 max-w-7xl lg:pl-96">
        {/* Floating history sidebar for large screens */}
        <div className="hidden lg:block fixed left-8 top-24 w-80 z-40">
          <Card className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Search History</CardTitle>
              <CardDescription className="text-sm">Your recent queries (click to reuse)</CardDescription>
            </CardHeader>
            <CardContent className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="mb-3">
                <Input placeholder="Search history..." value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} />
              </div>
              <div className="space-y-3">
                {(!queries || queries.length === 0) && (
                  <div className="text-sm text-muted-foreground">No history yet. Your submitted queries will appear here.</div>
                )}
                {queries && [...queries].reverse().filter(q => q.content.toLowerCase().includes(historyFilter.toLowerCase())).slice(0, 30).map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setValue('content', q.content);
                      setValue('type', q.type as any);
                      setQueryType(q.type);
                      if (q.imageUrl) {
                        toast.info('This history item had an image. You may re-upload to replace it.');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left p-3 rounded-lg hover:bg-forest-50/60 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground line-clamp-2">{q.content}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(q.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="ml-3">
                        <span className="inline-block text-xs px-2 py-1 rounded-full bg-forest-100 text-forest-700">{q.type}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Enhanced Header with Background Pattern */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-100/20 via-wheat-100/20 to-harvest-100/20 rounded-3xl blur-3xl -z-10"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-forest-700 via-forest-600 to-forest-800 bg-clip-text text-transparent mb-6">
              Ask Your Agricultural Query
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get expert advice on crops, pests, weather, fertilizers, and more.
              Choose your preferred method to ask questions and receive AI-powered insights.
            </p>
          </div>
        </div>

        {/* Enhanced Profile Check */}
        {!profile && (
          <Alert className="mb-8 border-harvest-200 bg-gradient-to-r from-harvest-50 to-wheat-50 shadow-sm">
            <AlertCircle className="h-4 w-4 text-harvest-600" />
            <AlertDescription className="text-harvest-700 font-medium">
              💡 For better assistance, consider setting up your farmer profile with crop and location details.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Enhanced Query Type Selection */}
          <Card className="overflow-hidden border border-white/10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-forest-50 to-wheat-50 border-b">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span>How would you like to ask your question?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {queryTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = queryType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setQueryType(option.value as any);
                        setValue('type', option.value as any);
                      }}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] hover:shadow-xl ${
                        isSelected
                          ? 'border-forest-500 bg-gradient-to-br from-forest-50 to-forest-100 shadow-2xl ring-1 ring-forest-100'
                          : 'border-border hover:border-forest-300 bg-white hover:bg-gradient-to-br hover:from-forest-50/50 hover:to-wheat-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-forest-500 to-forest-600 shadow-lg text-white'
                            : 'bg-gray-50 text-forest-600 group-hover:bg-gradient-to-br group-hover:from-forest-400 group-hover:to-forest-500 group-hover:text-white'
                        }`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-white'}`} />
                        </div>
                        <div>
                          <span className={`font-semibold text-lg ${isSelected ? 'text-forest-700' : 'text-foreground'}`}>
                            {option.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
                      {isSelected && (
                        <div className="mt-3 flex items-center text-forest-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Category Selection */}
          <Card className="overflow-hidden border border-white/10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-wheat-50 to-harvest-50 border-b">
              <CardTitle className="text-xl">Query Category</CardTitle>
              <CardDescription className="text-base">Select the category that best describes your question</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Select onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger className="h-12 text-base border-2 hover:border-forest-300 transition-colors">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="py-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={`${category.color} font-medium`}>
                          {category.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-2 font-medium">{errors.category.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Query Content */}
          <Card className="overflow-hidden border border-white/10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardHeader className="bg-gradient-to-r from-harvest-50 to-forest-50 border-b">
              <CardTitle className="text-xl">Your Question</CardTitle>
              <CardDescription className="text-base">
                {queryType === 'text' && '✍️ Describe your agricultural question in detail'}
                {queryType === 'image' && '📸 Upload an image and describe what you want to know about it'}
                {queryType === 'voice' && '🎤 Record your voice message or provide additional text details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Enhanced Text Input */}
              <div>
                <Label htmlFor="content" className="text-base font-semibold mb-3 block">Question Details</Label>
                <Textarea
                  id="content"
                  placeholder={
                    queryType === 'text'
                      ? "Describe your problem in detail. Include information about your crop, location, and specific symptoms you're observing..."
                      : queryType === 'image'
                      ? "Describe what you see in the image and what specific advice you need..."
                      : "Add any additional details about your voice query..."
                  }
                  className="min-h-40 text-base border-2 hover:border-forest-300 focus:border-forest-500 transition-colors resize-none"
                  {...register('content')}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-2 font-medium">{errors.content.message}</p>
                )}
              </div>

              {/* Enhanced Image Upload */}
              {(queryType === 'image' || selectedImage) && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Upload Image</Label>
                  <div className="mt-3">
                    {selectedImage ? (
                      <div className="relative inline-block group">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Uploaded crop/pest image"
                          className="w-56 h-56 object-cover rounded-2xl border-2 border-forest-200 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg group-hover:scale-110 transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-forest-300 rounded-2xl cursor-pointer hover:bg-forest-50/50 transition-all hover:border-forest-500 group">
                        <div className="flex flex-col items-center justify-center pt-6 pb-6">
                          <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest-200 transition-colors">
                            <Upload className="w-6 h-6 text-forest-600" />
                          </div>
                          <p className="text-base text-forest-700 font-medium mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">PNG, JPG or WebP (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Voice Recording */}
              {queryType === 'voice' && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Voice Recording</Label>
                  <div className="mt-3 p-6 border-2 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-100'
                        }`}>
                          {isRecording ? (
                            <MicOff className="w-6 h-6 text-white" />
                          ) : (
                            <Mic className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <span className="text-base font-medium">
                            {isRecording ? 'Recording... Speak clearly' : 'Click to start recording'}
                          </span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isRecording ? 'Your voice is being captured' : 'Speak in your preferred language'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={toggleRecording}
                        className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} transition-all`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-5 h-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="mt-4 flex items-center space-x-3 p-3 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="text-sm font-medium text-red-700">Recording in progress...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 min-w-56 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Submitting Query...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  Submit Query
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Enhanced Help Section */}
        <Card className="mt-12 bg-gradient-to-br from-forest-50/50 via-white to-wheat-50/50 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-forest-100 to-wheat-100 border-b">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span>💡 Tips for Better Responses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-forest-100">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-base">Be specific about your crop type, growth stage, and location</span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-forest-100">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-base">For image queries, ensure photos are clear and well-lit</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-forest-100">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-base">Include symptoms, duration, and any treatments already tried</span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-forest-100">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <span className="text-base">Voice queries work best in Hindi, English, or your regional language</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AskQuery;