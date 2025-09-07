import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  IndianRupee, 
  Shield, 
  GraduationCap, 
  HandCoins,
  Search,
  ExternalLink,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useFarmerStore } from "@/store/farmerStore";

const Schemes = () => {
  const { schemes, setSchemes } = useFarmerStore();
  const [filteredSchemes, setFilteredSchemes] = useState(schemes);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock schemes data
  const mockSchemes = [
    {
      id: '1',
      name: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support to farmers. Rs. 6000 per year in three installments.',
      eligibility: ['Small & marginal farmers', 'Landholding up to 2 hectares', 'Valid Aadhaar card'],
      benefits: 'Rs. 6000 per year (Rs. 2000 every 4 months)',
      howToApply: 'Apply online at pmkisan.gov.in or visit nearest Common Service Center',
      deadline: '2024-12-31',
      category: 'subsidy' as const,
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme providing financial support to farmers in case of crop loss.',
      eligibility: ['All farmers growing notified crops', 'Valid land documents', 'Bank account'],
      benefits: 'Coverage against crop loss due to natural calamities, pests, and diseases',
      howToApply: 'Apply through banks, insurance companies, or online portal',
      deadline: '2024-06-30',
      category: 'insurance' as const,
    },
    {
      id: '3',
      name: 'Kisan Credit Card (KCC)',
      description: 'Credit facility for agricultural needs with subsidized interest rates.',
      eligibility: ['Farmers owning cultivable land', 'Good credit history', 'Valid documents'],
      benefits: 'Low interest loans up to Rs. 3 lakh at 7% interest',
      howToApply: 'Visit any bank branch with required documents',
      category: 'loan' as const,
    },
    {
      id: '4',
      name: 'Soil Health Card Scheme',
      description: 'Free soil testing and health cards to improve soil fertility and crop productivity.',
      eligibility: ['All farmers', 'Land ownership documents'],
      benefits: 'Free soil testing and nutrient management recommendations',
      howToApply: 'Contact local agriculture department or soil health centers',
      category: 'subsidy' as const,
    },
    {
      id: '5',
      name: 'Krishi Vigyan Kendra Training',
      description: 'Skill development and training programs for modern farming techniques.',
      eligibility: ['Farmers and rural youth', 'Age 18-45 years', 'Basic education'],
      benefits: 'Free training, certificates, and sometimes financial assistance',
      howToApply: 'Contact nearest Krishi Vigyan Kendra or agriculture university',
      category: 'training' as const,
    },
    {
      id: '6',
      name: 'National Agriculture Market (e-NAM)',
      description: 'Online trading platform for agricultural commodities with transparent pricing.',
      eligibility: ['Registered farmers', 'Quality produce', 'Valid documents'],
      benefits: 'Better price discovery, transparent trading, wider market access',
      howToApply: 'Register at enam.gov.in or visit participating mandis',
      category: 'subsidy' as const,
    }
  ];

  useEffect(() => {
    setSchemes(mockSchemes);
  }, [setSchemes]);

  useEffect(() => {
    let filtered = schemes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  }, [schemes, selectedCategory, searchTerm]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'subsidy': return <HandCoins className="w-5 h-5" />;
      case 'loan': return <IndianRupee className="w-5 h-5" />;
      case 'insurance': return <Shield className="w-5 h-5" />;
      case 'training': return <GraduationCap className="w-5 h-5" />;
      default: return <HandCoins className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subsidy': return 'bg-green-100 text-green-700';
      case 'loan': return 'bg-blue-100 text-blue-700';
      case 'insurance': return 'bg-purple-100 text-purple-700';
      case 'training': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isDeadlineNear = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const categories = [
    { value: 'subsidy', label: 'Subsidies', icon: HandCoins },
    { value: 'loan', label: 'Loans', icon: IndianRupee },
    { value: 'insurance', label: 'Insurance', icon: Shield },
    { value: 'training', label: 'Training', icon: GraduationCap }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Government Schemes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore and apply for various government subsidies, loans, insurance schemes, and training programs designed for farmers.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Find Schemes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Schemes</label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const count = schemes.filter(s => s.category === category.value).length;
          return (
            <Card 
              key={category.value}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(category.value)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-lg ${getCategoryColor(category.value)} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{count} schemes</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schemes List */}
      <div className="space-y-6">
        {filteredSchemes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Schemes Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-lg ${getCategoryColor(scheme.category)}`}>
                      {getCategoryIcon(scheme.category)}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{scheme.name}</CardTitle>
                      <CardDescription className="text-base">
                        {scheme.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge variant="outline" className={`${getCategoryColor(scheme.category)} capitalize`}>
                      {scheme.category}
                    </Badge>
                    {scheme.deadline && (
                      <Badge 
                        variant="outline" 
                        className={
                          isExpired(scheme.deadline) 
                            ? 'bg-red-100 text-red-700' 
                            : isDeadlineNear(scheme.deadline)
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {isExpired(scheme.deadline) ? 'Expired' : 'Active'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Benefits
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">{scheme.benefits}</p>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                  <ul className="space-y-1 pl-4">
                    {scheme.eligibility.map((criteria, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How to Apply */}
                <div>
                  <h4 className="font-semibold mb-2">How to Apply</h4>
                  <p className="text-sm text-muted-foreground">{scheme.howToApply}</p>
                </div>

                {/* Deadline */}
                {scheme.deadline && (
                  <div>
                    <h4 className="font-semibold mb-2">Application Deadline</h4>
                    <p className={`text-sm ${
                      isExpired(scheme.deadline) 
                        ? 'text-red-600' 
                        : isDeadlineNear(scheme.deadline)
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {new Date(scheme.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {isDeadlineNear(scheme.deadline) && !isExpired(scheme.deadline) && (
                        <span className="ml-2 text-yellow-600 font-medium">(Deadline approaching)</span>
                      )}
                      {isExpired(scheme.deadline) && (
                        <span className="ml-2 text-red-600 font-medium">(Expired)</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    className="bg-forest-600 hover:bg-forest-700"
                    disabled={isExpired(scheme.deadline)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle>Need Help with Applications?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you need assistance with scheme applications or have questions about eligibility:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline">
              Contact Local Officer
            </Button>
            <Button variant="outline">
              Visit Common Service Center
            </Button>
            <Button variant="outline">
              Call Helpline: 1800-XXX-XXXX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schemes;
