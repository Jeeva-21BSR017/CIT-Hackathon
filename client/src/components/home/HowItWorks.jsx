import React, { useEffect, useRef } from "react";
import { Upload, Search, Trophy, Sparkles } from "lucide-react";
import AnimatedHeading from "../ui/AnimatedHeading";

const steps = [
  {
    number: "01",
    title: "Upload Your Academic Activities",
    description:
      "Effortlessly upload, organize, and showcase your certifications, course completions, and achievements in one place.",
    icon: Upload,
    delay: 100,
  },
  {
    number: "02",
    title: "Connect All Platforms",
    description:
      "Link your accounts from LeetCode, GeeksForGeeks, and CodeChef to automatically import achievements.",
    icon: Search,
    delay: 200,
  },
  {
    number: "03",
    title: "Climb Your Department Leaderboard",
    description:
      "Earn points based on the difficulty and relevance of your certifications to rise in the rankings.",
    icon: Trophy,
    delay: 300,
  },
  {
    number: "04",
    title: "Get Personalized Recommendations",
    description:
      "Receive AI-powered suggestions for new certifications and skills to develop based on your profile.",
    icon: Sparkles,
    delay: 400,
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".step-item");
      elements.forEach((el) => {
        observer.observe(el);
      });
    }

    return () => {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll(".step-item");
        elements.forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-blue-600 mb-3">HOW IT WORKS</p>
          <AnimatedHeading gradient>
            Simple steps to getting started
          </AnimatedHeading>
          <p className="mt-4 text-xl text-gray-600">
            Our intuitive platform makes it easy to track and showcase your
            achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-item opacity-0 relative"
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}

              <div className="relative z-10 bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 h-full">
                <div className="mb-4 flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 mr-4">
                    <step.icon size={20} />
                  </div>
                  <span className="text-xl font-semibold text-blue-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
