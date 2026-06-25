/**
 * ToSom ToSomMatchCard — System component
 * 
 * Draggable match card with swipe overlay (Like / Nope).
 */

'use client';

import { FC, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { spacing, colors, shadows } from '@/design/tokens';
import { ToSomProfileCard } from './ToSomProfileCard';
import { ToSomGlassPanel } from './ToSomGlassPanel';

interface MatchProfile {
  avatarUrl: string;
  name: string;
  age: number;
  location: string;
  badges?: { label: string; variant?: 'gold' | 'success' | 'error' | 'neutral' }[];
  about?: string;
}

interface ToSomMatchCardProps {
  profile: MatchProfile;
  onLike: () => void;
  onDislike: () => void;
}

export const ToSomMatchCard: FC<ToSomMatchCardProps> = ({ profile, onLike, onDislike }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -100, 100, 200], [0, 1, 1, 0]);
  const [dragging, setDragging] = useState(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onLike();
    } else if (info.offset.x < -100) {
      onDislike();
    }
  };

  return (
    <div className="relative w-full" style={{ height: '520px' }}>
      <motion.div
        style={{
          x,
          rotate,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'grab',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        <ToSomProfileCard
          avatarUrl={profile.avatarUrl}
          name={profile.name}
          age={profile.age}
          location={profile.location}
          badges={profile.badges}
          about={profile.about}
        />

        {/* Swipe overlays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(77,255,136,0.3), transparent)',
            opacity: useTransform(x, [-100, 0], [0, 1]),
            scale: useTransform(x, [-100, 0], [0.8, 1]),
          }}
        >
          <span className="text-6xl font-bold" style={{ color: '#4DFF88', textShadow: '0 0 20px rgba(77,255,136,0.5)' }}>
            LIKE
          </span>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,77,0.3), transparent)',
            opacity: useTransform(x, [0, 100], [0, 1]),
            scale: useTransform(x, [100, 0], [0.8, 1]),
          }}
        >
          <span className="text-6xl font-bold" style={{ color: '#FF4D4D', textShadow: '0 0 20px rgba(255,77,77,0.5)' }}>
            NOPE
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ToSomMatchCard;