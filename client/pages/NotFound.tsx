import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Sprout } from "lucide-react";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16">
          <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sprout className="w-12 h-12 text-forest-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-forest-700 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-forest-600 hover:bg-forest-700">
              <Link to="/home">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
