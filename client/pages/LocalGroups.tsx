import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: "u1", name: "Rajesh Kumar", location: "Pune", coords: { lat: 18.5204, lon: 73.8567 } },
  { id: "u2", name: "Meera Singh", location: "Jaipur", coords: { lat: 26.9124, lon: 75.7873 } },
  { id: "u3", name: "Amit Patel", location: "Ahmedabad", coords: { lat: 23.0225, lon: 72.5714 } },
  { id: "u4", name: "Sunita Devi", location: "Lucknow", coords: { lat: 26.8467, lon: 80.9462 } },
];

const LocalGroups: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(mockUsers[0]);

  const locations = useMemo(() => Array.from(new Set(mockUsers.map((m) => m.location))), []);

  const filtered = useMemo(() => mockUsers.filter((m) => (selectedLocation === "all" ? true : m.location === selectedLocation)), [selectedLocation]);

  const handleConnect = (name: string) => {
    // Placeholder connect action; replace with real integration later
    alert(`Connection request sent to ${name}`);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-emerald-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white/95 border border-gray-200 rounded-2xl p-8 shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Local Groups & Farmers Nearby</h1>
              <p className="text-muted-foreground">Connect with nearby farmers and local groups. Click connect to send a request.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Filter by location:</label>
            <select className="border rounded px-3 py-2" value={selectedLocation} onChange={(e) => { setSelectedLocation(e.target.value); setSelectedUser(null); }}>
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                {filtered.map((u) => (
                  <Card key={u.id} className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-sm text-muted-foreground">{u.location}</div>
                    </div>
                    <div>
                      <Button onClick={(e) => { e.stopPropagation(); handleConnect(u.name); }}>Connect</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden border">
                {selectedUser ? (
                  <iframe
                    title="map"
                    src={`https://www.openstreetmap.org/export/embed.html?marker=${selectedUser.coords.lat}%2C${selectedUser.coords.lon}&layer=mapnik`}
                    className="w-full h-64"
                  />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">Select a user to view on map.</div>
                )}

                <div className="p-4">
                  {selectedUser ? (
                    <div>
                      <div className="font-semibold">{selectedUser.name}</div>
                      <div className="text-sm text-muted-foreground mb-3">{selectedUser.location}</div>
                      <Button onClick={() => handleConnect(selectedUser.name)}>Connect</Button>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No user selected.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LocalGroups;
