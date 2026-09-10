'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Eye, Pin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  id: number;
  title: string;
  summary?: string;
  coverImage?: string;
  isPinned?: boolean;
  viewCount?: number;
  createdAt: string;
  delay?: number;
}

export default function NewsCard({
  id,
  title,
  summary,
  coverImage,
  isPinned,
  viewCount,
  createdAt,
  delay = 0,
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/news/${id}`} className="block">
        <div className="glass-card overflow-hidden group">
          {/* 封面图 */}
          {coverImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {isPinned && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-minecraft-green px-2 py-1 rounded text-xs text-white">
                  <Pin size={12} />
                  置顶
                </div>
              )}
            </div>
          )}
          
          <div className="p-5">
            {/* 标题 */}
            <div className="flex items-start gap-2 mb-2">
              {!coverImage && isPinned && (
                <Pin size={16} className="text-minecraft-green flex-shrink-0 mt-1" />
              )}
              <h3 className="text-lg font-bold text-white group-hover:text-minecraft-green transition-colors line-clamp-2">
                {title}
              </h3>
            </div>
            
            {/* 摘要 */}
            {summary && (
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                {summary}
              </p>
            )}
            
            {/* 元信息 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(createdAt)}
              </div>
              {viewCount !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {viewCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
