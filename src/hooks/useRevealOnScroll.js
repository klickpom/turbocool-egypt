import { useEffect, useRef } from 'react';

export const useRevealOnScroll = (...deps) => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nested = [...root.querySelectorAll('.reveal-up')];
    const nodes = root.classList.contains('reveal-up') ? [root, ...nested] : nested;
    const unique = [...new Set(nodes)];

    if (reduce || !('IntersectionObserver' in window)) {
      unique.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    unique.forEach((node, index) => {
      if (node.classList.contains('is-visible')) return;
      node.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
      io.observe(node);
    });

    return () => io.disconnect();
  }, deps);

  return ref;
};
