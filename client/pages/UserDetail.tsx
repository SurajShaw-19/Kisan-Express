import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { useAdminStore } from '@/store/adminStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAdminStore((s) => s.getUserById(id || ''));
  const deleteUser = useAdminStore((s) => s.deleteUser);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">The requested user does not exist.</p>
            <div className="mt-4">
              <Button onClick={() => navigate(-1)}>Go back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{(user.firstName[0] || 'U') + (user.lastName?.[0] || '')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/admin')}>Back to Admin</Button>
              {user.role !== 'admin' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete user account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {user.firstName} {user.lastName}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={async () => { await deleteUser(user.id!); navigate('/admin'); }}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-muted-foreground">Phone</h3>
                <p className="font-medium">{user.phoneNumber || '—'}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Location</h3>
                <p className="font-medium">{user.location?.district}, {user.location?.state} {user.location?.pincode ? `• ${user.location.pincode}` : ''}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Farm Size</h3>
                <p className="font-medium">{user.farmSize ? `${user.farmSize} acres` : '—'}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Crops</h3>
                <p className="font-medium">{user.crops && user.crops.length ? user.crops.join(', ') : '—'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-muted-foreground">Experience</h3>
                <p className="font-medium">{user.farmingExperience ? `${user.farmingExperience} years` : '—'}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Language</h3>
                <p className="font-medium">{user.language || '—'}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Verified</h3>
                <p className="font-medium">{user.isVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">Joined</h3>
                <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
