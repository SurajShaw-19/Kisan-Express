import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { useFarmerStore } from "@/store/farmerStore";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const AdminDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const users = useAdminStore((s) => s.users);
  const fetchUsers = useAdminStore((s) => s.fetchUsers);
  const deleteUser = useAdminStore((s) => s.deleteUser);
  const notifications = useAdminStore((s) => s.notifications);
  const markNotificationRead = useAdminStore((s) => s.markNotificationRead);
  const getUserById = useAdminStore((s) => s.getUserById);

  const queries = useFarmerStore((s) => s.queries);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'admin'>('all');

  useEffect(() => {
    // fetch users once on mount
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        (u.id || '').toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter]);

  const totalUsers = users.length;
  const totalFarmers = users.filter((u) => u.role === 'farmer').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const verified = users.filter((u) => u.isVerified).length;

  const feedback = useAdminStore((s) => s.feedback);
  const fetchFeedback = useAdminStore((s) => s.fetchFeedback);
  const deleteFeedback = useAdminStore((s) => s.deleteFeedback);
  const totalFeedback = feedback.length;

  // Top crops aggregation
  const topCrops = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((u) => {
      (u.crops || []).forEach((c) => map.set(c, (map.get(c) || 0) + 1));
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [users]);

  // Top query categories from farmerStore queries
  const topCategories = useMemo(() => {
    const map = new Map<string, number>();
    queries.forEach((q) => map.set(q.category, (map.get(q.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [queries]);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pop-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of users, farmer data, top issues and notifications.</p>
          <div className="mt-4 h-1 w-40 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-violet-500 shadow-md" />
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="font-semibold">{user?.firstName} {user?.lastName} {user?.adminId ? `(${user.adminId})` : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 card-entrance">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Users className="w-5 h-5" /> Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-sm text-white/90">Total registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><BarChart3 className="w-5 h-5" /> Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFarmers}</p>
            <p className="text-sm text-white/90">Total farmers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Shield className="w-5 h-5" /> Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAdmins}</p>
            <p className="text-sm text-white/90">Total admins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2"><Users className="w-5 h-5" /> Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFeedback}</p>
            <p className="text-sm text-white/90">Customer feedback entries</p>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 card-entrance">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle>Users</CardTitle>
                  <p className="text-sm text-muted-foreground">Search, filter, and manage user accounts.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search by name, email or id" value={query} onChange={(e) => setQuery(e.target.value)} />
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="farmer">Farmers</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-white to-amber-50 shadow-inner rounded-b-lg">
              <Table className="bg-transparent">
                <TableHeader>
                  <tr>
                    <TableHead className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white">Profile</TableHead>
                    <TableHead className="bg-gradient-to-r from-amber-400 to-amber-500 text-white">Name</TableHead>
                    <TableHead className="bg-gradient-to-r from-sky-400 to-sky-500 text-white">Email</TableHead>
                    <TableHead className="bg-gradient-to-r from-violet-400 to-violet-500 text-white">Role</TableHead>
                    <TableHead className="bg-gradient-to-r from-slate-400 to-slate-500 text-white">Joined</TableHead>
                    <TableHead className="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white">Actions</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id} className="hover:bg-gradient-to-r hover:from-white hover:to-amber-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{(u.firstName[0] || 'U') + (u.lastName?.[0] || '')}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <div className="font-medium">{u.firstName} {u.lastName}</div>
                            <div className="text-muted-foreground text-xs">{u.phoneNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{u.firstName} {u.lastName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/users/${u.id}`} className="text-sm text-white underline bg-gradient-to-r from-sky-500 to-sky-600 px-2 py-1 rounded">View</Link>
                          {u.role !== 'admin' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-red-500 to-rose-500 text-white" size="sm">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete user account</AlertDialogTitle>
                                  <AlertDialogDescription>Are you sure you want to delete {u.firstName} {u.lastName}? This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => { await handleDelete(u.id); }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner rounded-b-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Top Crops</h4>
                  {topCrops.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No crop data available</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {topCrops.slice(0, 5).map(([crop, count]) => (
                        <li key={crop} className="flex items-center justify-between">
                          <span className="font-medium">{crop}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-sm text-muted-foreground">Top Query Topics</h4>
                  {topCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No query data available</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {topCategories.slice(0, 5).map(([cat, count]) => (
                        <li key={cat} className="flex items-center justify-between">
                          <span className="font-medium capitalize">{cat}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="text-sm text-muted-foreground">Recent Notifications</h4>
                  <div className="mt-2 space-y-2">
                    {notifications.length === 0 && <div className="text-sm text-muted-foreground">No notifications</div>}
                    {notifications.slice(0, 5).map((n) => (
                      <div key={n.id} className={`p-2 rounded-md border ${n.read ? 'bg-muted/50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">{n.message}</div>
                          <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleTimeString()}</div>
                        </div>
                        {!n.read && <div className="mt-2"><Button size="sm" onClick={() => markNotificationRead(n.id)}>Mark read</Button></div>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </CardContent>

          <Card className="mt-4 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/settings">System Settings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {feedback.length === 0 ? (
                <p className="text-sm text-muted-foreground">No feedback yet</p>
              ) : (
                feedback.slice(0,5).map((f) => {
                  const u = getUserById(f.userId || '');
                  return (
                    <div key={f.id} className="p-2 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{u ? `${u.firstName} ${u.lastName}` : 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{f.queryCategory} — {new Date(f.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="xs" onClick={() => { /* view */ }}>View</Button>
                          <Button size="xs" variant="destructive" onClick={() => deleteFeedback(f.id)}>Delete</Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">{f.queryText}</div>
                      <div className="text-sm mt-1">Response: <span className="font-medium">{f.responseText}</span></div>
                    </div>
                  );
                })
              )}
              <div className="text-right mt-2">
                <Button asChild>
                  <Link to="/admin/feedback">View all feedback</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          </Card>

          <Card className="mt-4 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/settings">System Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
