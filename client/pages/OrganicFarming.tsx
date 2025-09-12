import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, Sun, CloudRain, BookOpen, Image } from 'lucide-react';

const OrganicFarming: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white/95 border border-gray-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-forest-600 p-3 shadow-lg flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Organic Farming</h1>
              <p className="text-muted-foreground mt-1 max-w-xl">Practical, easy-to-follow organic farming techniques for small and medium farms — soil health, composting, natural pest control, crop rotation and certification guidance.</p>
            </div>
          </div>

          {/* Hero image + overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d"
                  alt="Organic farm with crops"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-semibold">Why organic farming?</h2>
                <p className="text-muted-foreground">Organic farming improves long-term soil fertility, reduces chemical inputs, and produces healthier crops. Below are actionable techniques you can start using this season.</p>
              </div>
            </div>

            <aside className="space-y-4">
              <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-forest-600 flex items-center justify-center p-2 text-white">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Climate & Seasons</h3>
                    <p className="text-sm text-muted-foreground">Plan crops according to local seasons; choose varieties adapted to your region for better yields.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-forest-600 flex items-center justify-center p-2 text-white">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Water Management</h3>
                    <p className="text-sm text-muted-foreground">Use mulching and drip irrigation to conserve water and maintain soil moisture.</p>
                  </div>
                </div>
              </Card>
            </aside>
          </div>

          {/* Techniques grid */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Key Organic Techniques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="border rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Soil Health & Composting</h3>
                    <p className="text-sm text-muted-foreground">Make on-farm compost using crop residues and animal manure. Use compost tea to boost soil microbiome.</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d" alt="compost pile" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d" alt="soil" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=800&auto=format&fit=crop&s=9b3a1e3a0b1f455d" alt="organic matter" className="rounded-md w-full h-20 object-cover" />
                    </div>
                  </div>
                </div>
              </article>

              <article className="border rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Natural Pest & Disease Management</h3>
                    <p className="text-sm text-muted-foreground">Use biopesticides, pheromone traps, intercropping, and beneficial insects instead of synthetic chemicals.</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <img src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=800&auto=format&fit=crop&s=1a2f6b6a" alt="pest trap" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d" alt="beneficial insects" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d" alt="intercropping" className="rounded-md w-full h-20 object-cover" />
                    </div>
                  </div>
                </div>
              </article>

              <article className="border rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Crop Rotation & Diversification</h3>
                    <p className="text-sm text-muted-foreground">Rotate legumes with cereals to fix nitrogen naturally and break pest cycles.</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&s=8c7f0d8d5f1e8b4d2b2d6f6f5b1c7e2d" alt="crop rotation" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop&s=3fbae5a2" alt="mixed cropping" className="rounded-md w-full h-20 object-cover" />
                      <img src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop&s=5e6a1c8" alt="legumes" className="rounded-md w-full h-20 object-cover" />
                    </div>
                  </div>
                </div>
              </article>

              <article className="border rounded-xl p-4 shadow-sm bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-rose-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Certification & Market Access</h3>
                    <p className="text-sm text-muted-foreground">Understand organic certification steps and access premium markets for organic produce.</p>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Step-by-step compost guide */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Composting — Step by Step</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Collect Materials', text: 'Gather crop residues, green leaves, kitchen waste and animal manure.' },
                { title: 'Layering', text: 'Alternate green and brown layers to balance carbon and nitrogen.' },
                { title: 'Maintain Moisture', text: 'Keep pile moist but not waterlogged, turn occasionally.' },
                { title: 'Cure & Use', text: 'Let compost mature 2-4 months, then apply to soil.' },
              ].map((s) => (
                <div key={s.title} className="p-4 border rounded-lg bg-white shadow-sm text-center">
                  <div className="text-xl font-semibold mb-2">{s.title}</div>
                  <div className="text-sm text-muted-foreground">{s.text}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Resources & Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Beginner's Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">A practical checklist to start organic farming on your field.</p>
                <a href="https://www.example.com/organic-guide" target="_blank" rel="noreferrer" className="inline-block">
                  <Button>Read Guide</Button>
                </a>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-2">Local Trainings</h3>
                <p className="text-sm text-muted-foreground mb-4">Find training programs in your area for hands-on learning.</p>
                <Link to="/training-programs">
                  <Button variant="ghost">Find Trainings</Button>
                </Link>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect with farmers practicing organic methods.</p>
                <Link to="/about">
                  <Button variant="outline">Join Community</Button>
                </Link>
              </Card>
            </div>
          </section>

          <div className="mt-8 flex items-center justify-between">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <a href="https://example.com/organic-resources" target="_blank" rel="noreferrer">
              <Button>Explore More Resources</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganicFarming;
