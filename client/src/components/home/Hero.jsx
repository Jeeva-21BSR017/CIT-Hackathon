
import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import GradientButton from '../ui/GradientButton';
import { Link } from 'react-router-dom';
import heroimage from "../../assets/graduation hats-rafiki.png"

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        observer.observe(el);
      });
    }

    return () => {
      if (heroRef.current) {
        const elements = heroRef.current.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  // Animation for floating image
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.classList.add('animate-float');
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-20 hero-gradient"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="animate-on-scroll opacity-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                The Future of Student Achievement Tracking
              </div>
            </div>
            
            <h1 className="animate-on-scroll opacity-0 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Unify Your <span className="text-gradient">Achievements</span> In One Powerful Platform
            </h1>
            
            <p className="animate-on-scroll opacity-0 text-lg text-gray-600 max-w-xl">
              Combine all your certifications, workshop achievements, and coding platform results in one place. Get personalized AI recommendations and climb your department's leaderboard.
            </p>
            
            <div className="animate-on-scroll opacity-0 flex flex-col sm:flex-row gap-4 pt-4">
              <GradientButton size="lg">
                Get Started
                <ChevronRight size={18} />
              </GradientButton>
              <Link to="/leaderboard">
                <GradientButton size="lg" variant="outline">
                  View Leaderboards
                </GradientButton>
              </Link>
            </div>
            
            <div className="animate-on-scroll opacity-0 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Trusted by students from top universities</p>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse-slow"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse-slow"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse-slow"></div>
                <div className="h-6 w-28 bg-gray-200 rounded animate-pulse-slow"></div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-on-scroll opacity-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-xl blur-xl transform -rotate-6"></div>
              <div className="relative bg-white border border-gray-100 rounded-xl shadow-xl p-1 overflow-hidden">
                <div ref={imageRef} className="bg-gray-100 aspect-video rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="" src={heroimage} alt="Graduation Hat flying in the sky">
                    <img className="" src={heroimage} alt="Graduation Hat flyingon the sky" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-3 transform rotate-6 animate-float">
                <div className="h-8 w-32 bg-gradient-to-l from-blue-500 to-blue-400 rounded-md"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 transform -rotate-6 animate-float" style={{ animationDelay: '1s' }}>
                <div className="h-8 w-24 bg-gradient-to-r from-blue-500 to-blue-400 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
