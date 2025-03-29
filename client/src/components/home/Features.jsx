import React, { useEffect, useRef } from "react";
import { Award, Medal, BarChart3, Zap, Sparkles, Users } from "lucide-react";
import AnimatedHeading from "../ui/AnimatedHeading";
import GlassCard from "../ui/GlassCard";

const features = [
  {
    title: "Unified Certificate Management",
    description:
      "Consolidate course certifications, event achievements, and workshop credentials all in one place.",
    icon: Medal,
    delay: 100,
  },
  {
    title: "Department Leaderboards",
    description:
      "Compete with peers in your department based on certificate difficulty and accomplishments.",
    icon: Award,
    delay: 200,
  },
  {
    title: "AI-Powered Recommendations",
    description:
      "Receive intelligent suggestions for your next learning opportunity based on your current achievements.",
    icon: Sparkles,
    delay: 300,
  },
  {
    title: "Centralize Your Success",
    description:
      "Seamlessly import and showcase your accomplishments from platforms like LeetCode, GitHub, Kaggle, and more—all in one place.",
    icon: Zap,
    delay: 400,
  },
  {
    title: "Performance Analytics",
    description:
      "Visualize your progress with comprehensive analytics and skill development tracking.",
    icon: BarChart3,
    delay: 500,
  },
  {
    title: "Community Collaboration",
    description:
      "Connect with peers, share achievements, and collaborate on learning opportunities.",
    icon: Users,
    delay: 600,
  },
];

const Features = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll(".feature-card");
      elements.forEach((el) => {
        observer.observe(el);
      });
    }

    return () => {
      if (featuresRef.current) {
        const elements = featuresRef.current.querySelectorAll(".feature-card");
        elements.forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <section className="py-20 md:py-28" ref={featuresRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-blue-600 mb-3">FEATURES</p>
          <div className="mb-10">
            <AnimatedHeading gradient>
              Everything you need to excel
            </AnimatedHeading>
          </div>
          <p className="mt-4 text-xl text-gray-600">
            Our platform brings together all your achievements in one place,
            helping you track progress and discover new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card opacity-0"
              style={{ transitionDelay: `${feature.delay}ms` }}
            >
              <GlassCard className="h-full" hoverEffect>
                <div className="flex flex-col h-full">
                  <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
