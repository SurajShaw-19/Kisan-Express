import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "@/hooks/use-toast";

const AdminFeedback: React.FC = () => {
  const [message, setMessage] = useState("");
  const { addNotification } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: "Cannot submit empty feedback", description: "Please enter a message.", duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    // Simulate save
    setTimeout(() => {
      addNotification({ message: `Admin feedback: ${message}`, read: false });
      toast({ title: "Feedback submitted", description: "Your feedback has been recorded.", duration: 3000 });
      setMessage("");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-pop-in">
      <Card>
        <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-wheat-50 border-b">
          <CardTitle className="text-2xl">Admin Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">Use this form to add internal feedback or notes related to system operations and user reports.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
              <Textarea id="feedback" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button type="submit" className="bg-emerald-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/admin">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeedback;
