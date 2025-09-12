import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockUsers = [
  { id: "u1", name: "Rajesh Kumar", location: "Pune" },
  { id: "u2", name: "Meera Singh", location: "Jaipur" },
  { id: "u3", name: "Amit Patel", location: "Ahmedabad" },
  { id: "u4", name: "Sunita Devi", location: "Lucknow" },
];

const LocalGroups: React.FC = () => {
  const handleConnect = (name: string) => {
    // Placeholder connect action; replace with real integration later
    alert(`Connection request sent to ${name}`);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-emerald-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white/95 border border-gray-200 rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold mb-4">Local Groups & Farmers Nearby</h1>
          <p className="text-muted-foreground mb-6">Connect with nearby farmers and local groups. Click connect to send a request.</p>

          <div className="grid grid-cols-1 gap-4">
            {mockUsers.map((u) => (
              <Card key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-sm text-muted-foreground">{u.location}</div>
                </div>
                <div>
                  <Button onClick={() => handleConnect(u.name)}>Connect</Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LocalGroups;
