import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const CustomerSupport = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/95 border border-gray-200 rounded-2xl p-8 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Phone className="w-8 h-8 text-indigo-700" />
          </div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
        </div>

        <p className="text-muted-foreground mb-6">We're here to help with account issues, payments, technical help, or any questions about using the platform. Choose a contact option below.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Chat with Support</h3>
            <p className="text-sm text-muted-foreground">Start a text chat with our support team for quick help.</p>
          </Card>

          <Card className="p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Call Helpline</h3>
            <p className="text-sm text-muted-foreground">Call 1800-XXX-XXXX for urgent assistance.</p>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Button asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
