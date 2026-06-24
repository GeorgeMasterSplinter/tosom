/**
 * ProfileTemplate — Full profile page layout
 *
 * Usage:
 *   <ProfileTemplate user={profile}>
 *     <ProfileEditForm />
 *   </ProfileTemplate>
 */

import React from 'react';

export interface ProfileTemplateProps {
  /** Page children */
  children: React.ReactNode;
  /** Profile data */
  user?: {
    name: string;
    avatar?: string;
    bio?: string;
    age?: number;
    location?: string;
    tags?: string[];
  };
  /** Profile stats */
  stats?: Array<{ label: string; value: string | number }>;
  /** Edit mode */
  editable?: boolean;
  /** On save */
  onSave?: () => void;
  /** On cancel */
  onCancel?: () => void;
  /** Custom class */
  className?: string;
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  children,
  user,
  stats,
  editable = false,
  onSave,
  onCancel,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-ts-bg-primary ${className}`}>
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-ts-gold/20 via-ts-purple/10 to-transparent">
        <div className="absolute -bottom-12 left-6">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-ts-bg-primary shadow-[0_4px_20px_rgba(0,0,0,0.4)]" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-ts-gold/20 border-4 border-ts-bg-primary shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <span className="text-2xl font-bold text-ts-gold">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="pt-20 px-6 pb-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ts-primary">
                {user?.name}
                {user?.age && <span className="text-base text-ts-text-subtle font-normal">, {user.age}</span>}
              </h1>
              {user?.location && (
                <p className="text-sm text-ts-text-subtle mt-1">📍 {user.location}</p>
              )}
              {user?.bio && (
                <p className="text-sm text-ts-text-secondary mt-2 leading-relaxed">{user.bio}</p>
              )}
            </div>
            {editable && (
              <div className="flex gap-2">
                <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-ts-glass/50 border border-white/8 text-sm text-ts-text-secondary hover:text-ts-primary transition-all">
                  Avbryt
                </button>
                <button onClick={onSave} className="px-4 py-2 rounded-lg bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
                  Lagre
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          {user?.tags && user.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {user.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-ts-glass/50 border border-white/8 text-xs text-ts-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl bg-ts-glass/50 border border-white/8 p-3 text-center">
                <p className="text-xl font-bold text-ts-primary">{s.value}</p>
                <p className="text-xs text-ts-text-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Children */}
        {children}
      </div>
    </div>
  );
};

ProfileTemplate.displayName = 'ProfileTemplate';
export default ProfileTemplate;