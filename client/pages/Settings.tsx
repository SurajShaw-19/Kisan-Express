import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences, notifications, language and privacy settings.</p>

        <div id="account">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
                <Input placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                <Input placeholder="Phone number" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button>Save Account</Button>
              <Link to="/profile"><Button variant="ghost">View Profile</Button></Link>
            </div>
          </Card>
        </div>

        <div id="notifications">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Weather & Pest Alerts</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Query Responses</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" />
                <span className="text-sm">Marketing & Offers</span>
              </label>
            </div>
            <div className="mt-4">
              <Button>Save Notifications</Button>
            </div>
          </Card>
        </div>

        <div id="language">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Language & Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Language</label>
                <Select>
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Marathi</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Region</label>
                <Input placeholder="State / District" />
              </div>
            </div>
            <div className="mt-4">
              <Button>Save Language</Button>
            </div>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <div />
          <Link to="/home"><Button variant="outline">Back to Home</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
