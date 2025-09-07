import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Phone, MessageSquare, Video, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type Expert = {
  id: string;
  name: string;
  department: string;
  bio: string;
  fee: number; // in INR
  contact: string; // phone
};

const departments = [
  { key: 'pest', label: 'Pest Control' },
  { key: 'disease', label: 'Plant Disease' },
  { key: 'weather', label: 'Weather & Climate' },
  { key: 'fertilizer', label: 'Soil & Fertilizer' },
  { key: 'general', label: 'General Advisory' }
];

const experts: Expert[] = [
  { id: 'E001', name: 'Dr. Anil Kumar', department: 'pest', bio: 'Entomologist with 12 years experience in managing crop pests.', fee: 299, contact: '9999999991' },
  { id: 'E002', name: 'Dr. Neha Singh', department: 'disease', bio: 'Plant pathologist specializing in fungal diseases.', fee: 349, contact: '9999999992' },
  { id: 'E003', name: 'Mr. Ramesh Patil', department: 'weather', bio: 'Meteorologist focusing on microclimate advice for farms.', fee: 199, contact: '9999999993' },
  { id: 'E004', name: 'Ms. Priya Das', department: 'fertilizer', bio: 'Soil scientist with expertise in nutrient management.', fee: 249, contact: '9999999994' },
  { id: 'E005', name: 'Mr. Suresh Rao', department: 'general', bio: 'Senior agricultural officer providing general advisory.', fee: 149, contact: '9999999995' }
];

const ExpertSupport: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [paid, setPaid] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return experts.filter((e) => (selectedDept === 'all' ? true : e.department === selectedDept) && (query ? (e.name + ' ' + e.bio).toLowerCase().includes(query.toLowerCase()) : true));
  }, [selectedDept, query]);

  const startPayment = (expert: Expert) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedExpert(expert);
    setPaid(false);
  };

  const payNow = () => {
    // simulate payment
    setTimeout(() => setPaid(true), 800);
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    setChatMessages((m) => [...m, `You: ${messageInput.trim()}`]);
    setMessageInput('');
    // simulated expert reply
    setTimeout(() => setChatMessages((m) => [...m, `${selectedExpert?.name}: Thanks for the message. Please share a clear photo of the issue.`]), 1200);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Expert Support</h1>
          <p className="text-muted-foreground mt-1">Select the problem category to find the right expert. Contact via call, chat or video after payment.</p>
        </div>
        <div>
          <Badge>Secure</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filters & departments */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Problem Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button onClick={() => setSelectedDept('all')} className={`w-full text-left px-3 py-2 rounded ${selectedDept === 'all' ? 'bg-forest-600 text-white' : 'bg-white/70'}`}>All</button>
                {departments.map((d) => (
                  <button key={d.key} onClick={() => setSelectedDept(d.key)} className={`w-full text-left px-3 py-2 rounded ${selectedDept === d.key ? 'bg-forest-600 text-white' : 'bg-white/70'}`}>{d.label}</button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search experts" value={query} onChange={(e) => setQuery(e.target.value)} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Experts list and detail */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filtered.map((exp) => (
              <Card key={exp.id} className="flex flex-col justify-between">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{departments.find(d => d.key === exp.department)?.label}</p>
                      <p className="mt-2 text-sm">{exp.bio}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{exp.fee}</p>
                      <p className="text-xs text-muted-foreground">Per consultation</p>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 flex items-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => startPayment(exp)}><MessageSquare className="w-4 h-4 mr-2" />Contact</Button>
                  <Button size="sm" asChild>
                    <a href={`tel:${exp.contact}`}><Phone className="w-4 h-4 mr-2" />Call</a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Payment & contact area */}
          {selectedExpert && (
            <Card>
              <CardHeader>
                <CardTitle>Consultation with {selectedExpert.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">Department: {departments.find(d => d.key === selectedExpert.department)?.label}</p>
                  <p className="text-sm">Fee: ₹{selectedExpert.fee} per consultation</p>
                </div>

                {!paid ? (
                  <div className="flex items-center gap-4">
                    <Button onClick={payNow} className="bg-emerald-600 text-white">Pay ₹{selectedExpert.fee} Now</Button>
                    <Button variant="outline" onClick={() => { setSelectedExpert(null); setPaid(false); }}>Cancel</Button>
                    <p className="text-sm text-muted-foreground">(Payment simulated)</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-green-600 font-semibold">Payment successful! Contact options below are enabled.</p>
                    <div className="flex items-center gap-3">
                      <a className="inline-flex items-center px-4 py-2 bg-forest-600 text-white rounded" href={`tel:${selectedExpert.contact}`}><Phone className="w-4 h-4 mr-2" />Call</a>
                      <button className="inline-flex items-center px-4 py-2 bg-white border rounded" onClick={() => {
                        // show chat area
                      }}><MessageSquare className="w-4 h-4 mr-2" />Text</button>
                      <button className="inline-flex items-center px-4 py-2 bg-white border rounded" onClick={() => alert('Starting video call... (simulated)')}><Video className="w-4 h-4 mr-2" />Video Call</button>
                    </div>

                    {/* Chat area */}
                    <div className="mt-4">
                      <div className="bg-muted/30 rounded p-4 h-48 overflow-y-auto">
                        {chatMessages.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet. Say hello to start the consultation.</p> : chatMessages.map((m, i) => <p key={i} className="text-sm mb-2">{m}</p>)}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Input placeholder="Type your message" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                        <Button onClick={sendMessage}>Send</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertSupport;
