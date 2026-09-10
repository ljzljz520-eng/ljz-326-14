'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { announcementApi } from '@/lib/api';

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isPinned: boolean;
}

const typeConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
  },
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementApi.getLatest(5);
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Failed to fetch announcements');
    }
  };

  const dismissAnnouncement = (id: number) => {
    setDismissed([...dismissed, id]);
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissed.includes(a.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const current = visibleAnnouncements[currentIndex % visibleAnnouncements.length];
  if (!current) return null;

  const config = typeConfig[current.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${config.bg} ${config.border} border rounded-lg p-4 mb-6`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${config.text} mb-1`}>{current.title}</h4>
            <p className="text-gray-300 text-sm">{current.content}</p>
          </div>
          <button
            onClick={() => dismissAnnouncement(current.id)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* 指示器 */}
        {visibleAnnouncements.length > 1 && (
          <div className="flex justify-center gap-1 mt-3">
            {visibleAnnouncements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex % visibleAnnouncements.length
                    ? config.text.replace('text-', 'bg-')
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
