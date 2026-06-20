/**
 * Container — Max-width responsive container
 *
 * Usage:
 *   <Container size="xl">
 *     <p>Content</p>
 *   </Container>
 */

import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  /** Max-width size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Whether container is fluid (stretches) */
  fluid?: boolean;
  /** Whether to center horizontally */
  centered?: boolean;
  /** Custom class */
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  fluid = false,
  centered = true,
  className = '',
}) => {
  const widthMap: Record<NonNullable<ContainerProps['size']>, string> = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[80rem]',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        ${widthMap[size]}
        ${centered ? 'mx-auto' : ''}
        ${fluid ? 'w-full px-4 md:px-8' : 'px-4 md:px-8'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';
export default Container;