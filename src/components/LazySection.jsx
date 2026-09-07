import React, { useEffect, useRef, useState } from 'react';
import { RevealOnScroll } from './RevealOnScroll';

export const LazySection = ({ loader, rootMargin = '280px' }) => {
  const ref = useRef(null);
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let cancelled = false;
    const mount = () => {
      loader().then((mod) => {
        if (!cancelled) setComponent(() => mod.default);
      });
    };

    if (!('IntersectionObserver' in window)) {
      mount();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mount();
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [loader, rootMargin]);

  return <div ref={ref}>{Component ? <RevealOnScroll><Component /></RevealOnScroll> : <div className="min-h-[120px]" />}</div>;
};
