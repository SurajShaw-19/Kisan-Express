import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const DashboardProfile: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-lg text-muted-foreground">View and manage your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user ? `${user.firstName} ${user.lastName}` : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile</p>
              <p className="font-medium">{user?.phoneNumber || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{user?.location?.district ? `${user.location.district}, ${user.location.state}` : '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button variant="outline">Edit Profile</Button>
            <Button>Refresh Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
