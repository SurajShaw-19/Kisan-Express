import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

const TrainingPrograms = () => {
  const user = useAuthStore((s) => s.user);
  const area = user?.location?.district || user?.location?.state || 'your area';

  // Mocked programs - in a real app this would come from an API filtered by area
  const programs = [
    { title: 'Rice Cultivation Best Practices', date: '2025-09-18', location: area },
    { title: 'Integrated Pest Management Workshop', date: '2025-09-22', location: area },
    { title: 'Soil Health & Composting', date: '2025-10-02', location: area },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-4">Training Programs in {area}</h1>
        <p className="text-muted-foreground mb-6">Attend nearby workshops and training sessions to improve your skills and learn new sustainable techniques.</p>

        <div className="space-y-4 mb-6">
          {programs.map((p, idx) => (
            <Card key={idx} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-muted-foreground">{p.date} — {p.location}</div>
              </div>
              <Button asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>Register</a>
              </Button>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Button asChild>
            <a href="https://example.com/trainings" target="_blank" rel="noreferrer">Explore More</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
