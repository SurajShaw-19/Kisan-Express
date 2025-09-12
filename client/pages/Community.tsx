import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

const Community: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-emerald-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white/95 border border-gray-200 rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold mb-4">Community Forum</h1>
          <p className="text-muted-foreground mb-6">
            Connect with other farmers, ask questions, share experiences and find local groups.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Discussion Boards</h3>
              <p className="text-sm text-muted-foreground mb-4">Join topic-based discussions and learn from peers.</p>
              <Link to="/forum">
                <Button>Go to Forum</Button>
              </Link>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Local Groups</h3>
              <p className="text-sm text-muted-foreground mb-4">Find or create groups in your area for in-person meetups.</p>
              <Link to="/training-programs">
                <Button>Find Local Groups</Button>
              </Link>
            </Card>
          </div>

          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
