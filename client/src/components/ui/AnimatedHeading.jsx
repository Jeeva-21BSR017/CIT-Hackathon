
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const AnimatedHeading = ({
  children,
  className,
  gradient = false,
  delay = 0,
}) => {
  const headingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fade-in');
              entry.target.classList.remove('opacity-0');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, [delay]);

  return (
    <h2
      ref={headingRef}
      className={cn(
        'opacity-0 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight transition-all duration-700 p-1',
        gradient && 'text-gradient',
        className
      )}
    >
      {children}
    </h2>
  );
};

export default AnimatedHeading;
