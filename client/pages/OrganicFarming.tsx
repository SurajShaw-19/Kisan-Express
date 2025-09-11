import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import FarmerAnimation from '@/components/FarmerAnimation';

const OrganicFarming = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Leaf className="w-8 h-8 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold">Organic Farming</h1>
        </div>

        <p className="text-muted-foreground mb-6">Learn best practices for organic farming, including natural pest management, soil health, composting, and certification guidance.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Soil & Composting</h3>
            <p className="text-sm text-muted-foreground">Techniques to build healthy soil using organic inputs and composting methods suitable for small and large farms.</p>
          </Card>

          <Card className="p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Natural Pest Management</h3>
            <p className="text-sm text-muted-foreground">Use botanical extracts, traps and cultural practices to reduce reliance on synthetic pesticides.</p>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Button asChild>
            <a href="https://example.com/organic-resources" target="_blank" rel="noreferrer">Explore Resources</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganicFarming;
