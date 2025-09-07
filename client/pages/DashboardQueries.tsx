import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';

const DashboardQueries: React.FC = () => {
  // mock data - in real app fetch user's queries
  const queries = [
    { id: 'q1', content: 'White spots on cotton leaves', category: 'pest', status: 'in_progress', lastResponseAt: '2024-08-01T11:10:00Z' },
    { id: 'q2', content: 'Tomato leaves brown patches', category: 'disease', status: 'answered', lastResponseAt: '2024-07-28T12:00:00Z' },
  ];

  const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Queries</h1>
        <p className="text-lg text-muted-foreground">All queries you have submitted and their current status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Response</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{q.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="capitalize text-sm">{q.category}</p>
                    </TableCell>
                    <TableCell>
                      <p className="capitalize text-sm">{q.status}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(q.lastResponseAt)}</p>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardQueries;
