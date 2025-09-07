import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Cloud, 
  Bug, 
  Thermometer, 
  TrendingUp,
  MapPin,
  Calendar,
  Filter
} from "lucide-react";
import { useFarmerStore } from "@/store/farmerStore";

const Alerts = () => {
  const { profile, alerts, setAlerts } = useFarmerStore();
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);
  const [selectedDistrict, setSelectedDistrict] = useState(profile?.location.district || 'all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock alerts data
  const mockAlerts = [
    {
      id: '1',
      district: 'Pune',
      state: 'Maharashtra',
      type: 'weather' as const,
      severity: 'high' as const,
      title: 'Heavy Rainfall Alert',
      description: 'Heavy to very heavy rainfall expected in next 48 hours. Farmers advised to harvest ready crops and ensure proper drainage.',
      validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      district: 'Nashik',
      state: 'Maharashtra',
      type: 'pest' as const,
      severity: 'medium' as const,
      title: 'Brown Plant Hopper Outbreak',
      description: 'Increased BPH activity reported in rice fields. Regular monitoring and timely application of neem oil recommended.',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      district: 'Aurangabad',
      state: 'Maharashtra',
      type: 'disease' as const,
      severity: 'high' as const,
      title: 'Blast Disease in Rice',
      description: 'Blast disease symptoms observed in several rice fields. Immediate fungicide application and removal of infected plants advised.',
      validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      district: 'Pune',
      state: 'Maharashtra',
      type: 'price' as const,
      severity: 'low' as const,
      title: 'Tomato Price Surge',
      description: 'Tomato prices increased by 40% in wholesale markets. Good opportunity for tomato growers to sell produce.',
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      district: 'Pune',
      state: 'Maharashtra',
      type: 'weather' as const,
      severity: 'medium' as const,
      title: 'Temperature Drop Alert',
      description: 'Significant temperature drop expected over next 3 days. Protect sensitive crops from cold stress.',
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, [setAlerts]);

  useEffect(() => {
    let filtered = alerts;

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(alert => alert.district === selectedDistrict);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(alert => alert.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by severity and creation date
    filtered.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredAlerts(filtered);
  }, [alerts, selectedDistrict, selectedType, searchTerm]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weather': return <Cloud className="w-5 h-5" />;
      case 'pest': return <Bug className="w-5 h-5" />;
      case 'disease': return <AlertTriangle className="w-5 h-5" />;
      case 'price': return <TrendingUp className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weather': return 'bg-blue-100 text-blue-700';
      case 'pest': return 'bg-red-100 text-red-700';
      case 'disease': return 'bg-orange-100 text-orange-700';
      case 'price': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isAlertActive = (validUntil: string) => {
    return new Date(validUntil) > new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const districts = ['Pune', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'];
  const alertTypes = ['weather', 'pest', 'disease', 'price'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Agricultural Alerts
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with real-time alerts about weather, pests, diseases, and market prices in your region.
        </p>
      </div>

      {/* Location Info */}
      {profile && (
        <Alert className="mb-6 border-forest-200 bg-forest-50">
          <MapPin className="h-4 w-4 text-forest-600" />
          <AlertDescription className="text-forest-700">
            Showing alerts for <strong>{profile.location.district}, {profile.location.state}</strong> and nearby areas.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Alert Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {alertTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedDistrict !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your filters to see more alerts.'
                  : 'No active alerts for your area at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`${getSeverityColor(alert.severity)} ${!isAlertActive(alert.validUntil) ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(alert.type)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{alert.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {alert.district}, {alert.state}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(alert.createdAt)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className={`${getTypeColor(alert.type)} capitalize`}>
                      {alert.type}
                    </Badge>
                    <Badge variant="outline" className={`${getSeverityColor(alert.severity)} capitalize`}>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{alert.description}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Valid until: {formatDate(alert.validUntil)}
                  </span>
                  {!isAlertActive(alert.validUntil) && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Expired
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Contact */}
      <Card className="mt-8 bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-3">
            For urgent agricultural emergencies or severe weather alerts:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Call Emergency Helpline: 1800-XXX-XXXX
            </Button>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Contact Local Officer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
