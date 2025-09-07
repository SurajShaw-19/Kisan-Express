import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  Users, 
  Target, 
  Award,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  Shield,
  Zap,
  Globe
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Priya Sharma",
      role: "Lead Agricultural Expert",
      specialization: "Crop Protection & IPM",
      experience: "15+ years",
      qualification: "Ph.D. in Plant Pathology",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Rajesh Kumar",
      role: "Senior Developer",
      specialization: "AI/ML & Backend Systems",
      experience: "8 years",
      qualification: "M.Tech Computer Science",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Dr. Meera Joshi",
      role: "Soil Health Specialist",
      specialization: "Nutrition & Fertilizers",
      experience: "12+ years",
      qualification: "Ph.D. in Soil Science",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Arjun Patil",
      role: "Product Manager",
      specialization: "Farmer Experience & UX",
      experience: "6 years",
      qualification: "MBA in Product Management",
      image: "/api/placeholder/150/150"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Responses",
      description: "Get instant answers using advanced machine learning algorithms trained on agricultural data."
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Ask questions in Hindi, English, Bengali, Telugu, Tamil, and other regional languages."
    },
    {
      icon: Shield,
      title: "Expert Verified",
      description: "All responses are verified by certified agricultural experts and extension officers."
    },
    {
      icon: Heart,
      title: "Farmer-First Approach",
      description: "Designed specifically for Indian farmers with simple, practical, and actionable advice."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Farmers Served" },
    { number: "95%", label: "Query Resolution" },
    { number: "2.3 min", label: "Avg Response Time" },
    { number: "15+", label: "Languages Supported" }
  ];

  const partners = [
    "Indian Council of Agricultural Research (ICAR)",
    "Ministry of Agriculture & Farmers Welfare",
    "State Agricultural Universities",
    "Krishi Vigyan Kendras (KVKs)",
    "National Sample Survey Office (NSSO)"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-50 via-wheat-50 to-harvest-50 py-20">
        <div className="container px-4 mx-auto text-center">
          <div className="w-24 h-24 bg-forest-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-forest-900 mb-6">
            About Kisan Express
          </h1>
          
          <p className="text-xl text-forest-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Empowering farmers with AI-driven agricultural advice, real-time alerts, and expert guidance. 
            Our mission is to bridge the knowledge gap in Indian agriculture through technology.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-forest-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-forest-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To democratize agricultural knowledge and provide every farmer in India with access to 
                expert advice, regardless of their location or resources. We believe that technology 
                can bridge the gap between traditional farming wisdom and modern agricultural science.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Accessible Knowledge</h3>
                    <p className="text-muted-foreground">Making expert agricultural advice available to every farmer</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Community Building</h3>
                    <p className="text-muted-foreground">Connecting farmers with experts and fellow farmers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Sustainable Farming</h3>
                    <p className="text-muted-foreground">Promoting environmentally sustainable agricultural practices</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-forest-100 to-harvest-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-forest-800 mb-4">Our Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-forest-700">Crop Yield Improvement</span>
                    <Badge className="bg-green-100 text-green-700">+23%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-forest-700">Pest Control Success</span>
                    <Badge className="bg-green-100 text-green-700">89%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-forest-700">Farmer Satisfaction</span>
                    <Badge className="bg-green-100 text-green-700">94%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-forest-700">Response Accuracy</span>
                    <Badge className="bg-green-100 text-green-700">96%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for Indian farmers with cutting-edge technology and expert knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-forest-600" />
                  </div>
                  <h3 className="font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced agricultural experts and technology professionals working together for farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-forest-100 to-harvest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-forest-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-forest-600 font-medium mb-2">{member.role}</p>
                  <Badge variant="outline" className="mb-3">{member.specialization}</Badge>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{member.experience}</p>
                    <p>{member.qualification}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Collaborating with leading agricultural institutions and government bodies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-forest-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-forest-600" />
                  </div>
                  <h3 className="font-medium">{partner}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground">
                Have questions about our platform or want to collaborate? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <Phone className="w-8 h-8 text-forest-600 mx-auto mb-3" />
                  <CardTitle>Phone</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">1800-XXX-XXXX</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9 AM - 6 PM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Mail className="w-8 h-8 text-forest-600 mx-auto mb-3" />
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">info@krishiofficer.gov.in</p>
                  <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <MapPin className="w-8 h-8 text-forest-600 mx-auto mb-3" />
                  <CardTitle>Office</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold">New Delhi, India</p>
                  <p className="text-sm text-muted-foreground">Ministry of Agriculture</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Our Main Website
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
