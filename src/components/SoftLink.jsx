import React from 'react';
import { navigateSoft } from '../seo/navigate.js';

export const SoftLink = ({
  href,
  className,
  children,
  tab,
  sectionId,
  brand,
  onNavigate,
}) => (
  <a
    href={href}
    className={className}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      navigateSoft(href, { tab, sectionId, brand });
      onNavigate?.();
    }}
  >
    {children}
  </a>
);
