import React from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

export const RevealOnScroll = ({ children, className = '' }) => {
  const ref = useRevealOnScroll();
  return (
    <div ref={ref} className={`reveal-up ${className}`}>
      {children}
    </div>
  );
};
