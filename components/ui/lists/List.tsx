/**
 * List — Styled list container with consistent spacing
 *
 * Usage:
 *   <List>
 *     <ListItem>Item 1</ListItem>
 *     <ListItem>Item 2</ListItem>
 *   </List>
 */

import React from 'react';

export interface ListProps {
  children: React.ReactNode;
  /** List variant */
  variant?: 'default' | 'glass' | 'divider' | 'compact';
  /** Whether list is selectable */
  selectable?: boolean;
  /** Custom class */
  className?: string;
}

const List: React.FC<ListProps> = ({
  children,
  variant = 'default',
  selectable = false,
  className = '',
}) => {
  const variantMap: Record<NonNullable<ListProps['variant']>, string> = {
    default: 'divide-y divide-white/5',
    glass: 'divide-y divide-white/5',
    divider: 'divide-y divide-white/10',
    compact: 'gap-0.5',
  };

  return (
    <div
      className={`
        flex flex-col
        ${variantMap[variant]}
        ${selectable ? '' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

List.displayName = 'List';
export default List;

export interface ListItemProps {
  children: React.ReactNode;
  /** Whether item is selected */
  selected?: boolean;
  /** Whether item is active */
  active?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom class */
  className?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  children,
  selected = false,
  active = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3
        px-4 py-3
        text-sm
        text-ts-text-secondary
        cursor-pointer
        transition-all
        ${selected || active ? 'bg-ts-gold/10 text-ts-gold' : 'hover:bg-ts-glass hover:text-ts-text'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

ListItem.displayName = 'ListItem';
export { ListItem };