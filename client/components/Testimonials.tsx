import React, { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Ramesh Kumar",
    location: "Uttar Pradesh",
    text: "Kisan Express helped me identify a pest early — my yield improved by 20% this season!",
  },
  {
    name: "Meera Devi",
    location: "Madhya Pradesh",
    text: "The voice query feature is lifesaving. I can ask in my dialect and get instant advice.",
  },
  {
    name: "Suresh Patel",
    location: "Gujarat",
    text: "Applying for government schemes became simple with the app guidance. Highly recommended!",
  },
];

const TestimonialCard: React.FC<{ idx: number; active: boolean; item: typeof testimonials[0] }> = ({ idx, active, item }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-white/30 transform transition-all duration-500 ease-in-out ${
        active ? "opacity-100 scale-100" : "opacity-60 scale-95"
      }`}
      aria-hidden={!active}
    >
      <p className="text-lg text-foreground mb-4">“{item.text}”</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.location}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">{item.name.charAt(0)}</div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">What Farmers Say</h2>
          <p className="text-muted-foreground mt-2">Real stories from our community</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} idx={i} active={i === index} item={t} />
            ))}
          </div>

          <div className="flex items-center justify-center mt-6 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === index ? "bg-emerald-600 w-6" : "bg-emerald-200"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
