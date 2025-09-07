import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Leaf,
  AlertTriangle,
  FileText
} from "lucide-react";
import { feedbackSchema } from "@/lib/validation/schemas";
import { useFarmerStore } from "@/store/farmerStore";
import { z } from "zod";

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const Advisory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQueryById, updateQuery } = useFarmerStore();
  const [showFeedback, setShowFeedback] = useState(false);
  const query = getQueryById(id || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      queryId: id || '',
      rating: 5,
      helpful: true
    }
  });

  const watchedRating = watch('rating');

  // Mock advisory response based on query type and category
  const mockAdvisory = {
    id: id || '',
    status: 'answered' as const,
    response: query?.category === 'pest' 
      ? "Based on your description and image, this appears to be a bollworm infestation. Here's what you should do:\n\n1. **Immediate Action**: Apply Neem oil spray (10ml per liter) in the evening\n2. **Monitoring**: Check plants daily for new larvae\n3. **Prevention**: Install pheromone traps around the field\n4. **Chemical Control**: If infestation is severe, use Emamectin benzoate as per label instructions\n\n**Additional Tips**:\n- Remove affected bolls and destroy them\n- Maintain field hygiene\n- Consider intercropping with marigold for natural pest control"
      : query?.category === 'disease'
      ? "The symptoms indicate a possible fungal infection. Here's the recommended treatment plan:\n\n1. **Immediate Treatment**: Apply copper oxychloride fungicide (2g per liter)\n2. **Cultural Practices**: Improve drainage and reduce plant density\n3. **Organic Option**: Use a mixture of baking soda and liquid soap\n4. **Prevention**: Ensure proper air circulation between plants\n\n**Important Notes**:\n- Apply treatments during cooler parts of the day\n- Repeat application after 10-15 days if symptoms persist\n- Remove and destroy affected plant parts"
      : "Thank you for your query. Based on the information provided, here are the recommendations:\n\n1. **Current Season Advice**: This is a good time for the practices you mentioned\n2. **Best Practices**: Follow integrated crop management techniques\n3. **Monitoring**: Keep track of weather conditions and market prices\n4. **Next Steps**: Consider soil testing for better nutrient management\n\n**Additional Resources**:\n- Contact your local agricultural extension officer\n- Join farmer groups for knowledge sharing\n- Stay updated with weather forecasts",
    officerName: "Dr. Priya Sharma",
    officerTitle: "Senior Agricultural Officer",
    responseTime: "2 minutes",
    confidence: query?.category === 'pest' || query?.category === 'disease' ? 92 : 85,
    sources: [
      "Indian Council of Agricultural Research (ICAR)",
      "State Agricultural University Guidelines",
      "Integrated Pest Management Manual"
    ]
  };

  useEffect(() => {
    if (query && query.status === 'pending') {
      // Simulate processing time
      setTimeout(() => {
        updateQuery(id || '', { 
          status: 'answered',
          answeredAt: new Date().toISOString(),
          officerResponse: mockAdvisory.response
        });
      }, 2000);
    }
  }, [query, id, updateQuery]);

  const onSubmitFeedback = async (data: FeedbackFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your feedback!');
      setShowFeedback(false);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Query not found. Please check the URL or submit a new query.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/query')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ask New Query
        </Button>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pest': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'disease': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'weather': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'fertilizer': return <Leaf className="w-4 h-4 text-green-600" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pest': return 'bg-red-100 text-red-700';
      case 'disease': return 'bg-orange-100 text-orange-700';
      case 'weather': return 'bg-blue-100 text-blue-700';
      case 'fertilizer': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Badge variant="outline" className={getCategoryColor(query.category)}>
          {getCategoryIcon(query.category)}
          <span className="ml-1 capitalize">{query.category}</span>
        </Badge>
      </div>

      {/* Query Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Query</CardTitle>
            <Badge variant={query.status === 'answered' ? 'default' : 'secondary'}>
              {query.status === 'answered' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Answered
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Processing
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            Submitted on {new Date(query.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Query Details:</p>
          <p className="mb-4">{query.content}</p>
          
          {query.imageUrl && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Uploaded Image:</p>
              <img
                src={query.imageUrl}
                alt="Query image"
                className="w-48 h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Type: {query.type}</span>
            <span>•</span>
            <span>Category: {query.category}</span>
          </div>
        </CardContent>
      </Card>

      {/* Advisory Response */}
      {query.status === 'answered' ? (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Expert Advisory</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {mockAdvisory.confidence}% Confidence
                </Badge>
              </div>
            </div>
            <CardDescription>
              Responded by {mockAdvisory.officerName}, {mockAdvisory.officerTitle} • 
              Response time: {mockAdvisory.responseTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {mockAdvisory.response.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Reference Sources
              </h4>
              <ul className="space-y-1">
                {mockAdvisory.sources.map((source, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></span>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 border-4 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold mb-2">Processing Your Query</h3>
            <p className="text-muted-foreground">
              Our agricultural experts are analyzing your query. This usually takes 2-5 minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {query.status === 'answered' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Rate This Response</span>
            </CardTitle>
            <CardDescription>
              Your feedback helps us improve our advisory services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showFeedback ? (
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(true)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(true)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Not Helpful
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitFeedback)} className="space-y-4">
                <div>
                  <Label>Rate your experience (1-5 stars)</Label>
                  <RadioGroup
                    value={watchedRating?.toString()}
                    onValueChange={(value) => setValue('rating', parseInt(value))}
                    className="flex items-center space-x-2 mt-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-1">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`}>
                          <Star className={`w-4 h-4 ${watchedRating >= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="comment">Additional Comments (Optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us what worked well or how we can improve..."
                    {...register('comment')}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-forest-600 hover:bg-forest-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Advisory;
