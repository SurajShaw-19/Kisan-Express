import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const AdminFeedback: React.FC = () => {
  const [message, setMessage] = useState("");
  const addNotification = useAdminStore((s) => s.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // customer feedback data from adminStore
  const feedback = useAdminStore((s) => s.feedback);
  const deleteFeedback = useAdminStore((s) => s.deleteFeedback);
  const getUserById = useAdminStore((s) => s.getUserById);

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
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-pop-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-6 bg-gradient-to-r from-emerald-50 to-wheat-50 border-b">
            <CardTitle className="text-2xl">Admin Internal Feedback</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Customer Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.length === 0 ? (
              <p className="text-sm text-muted-foreground">No customer feedback recorded yet.</p>
            ) : (
              feedback.map((f) => {
                const u = getUserById(f.userId || '');
                return (
                  <div key={f.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{u ? `${u.firstName} ${u.lastName}` : 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{f.queryCategory} — {new Date(f.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/users/${f.userId}`}>View User</Link>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteFeedback(f.id)}>Delete</Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Question: {f.queryText}</div>
                    <div className="mt-1">Response: <span className="font-medium">{f.responseText}</span></div>
                    {typeof f.rating === 'number' && <div className="mt-1 text-sm">Rating: {f.rating}/5</div>}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFeedback;
