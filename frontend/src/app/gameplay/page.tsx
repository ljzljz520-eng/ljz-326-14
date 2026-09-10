'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { gameplayApi } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import { SkeletonCard } from '@/components/LoadingSpinner';

const gameModeIcons: Record<string, string> = {
  survival: '⚔️',
  creative: '🏰',
  adventure: '🗺️',
  spectator: '👁️',
};

export default function GameplayPage() {
  const [gameplays, setGameplays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => {
    fetchGameplays();
  }, []);

  const fetchGameplays = async () => {
    try {
      const data = await gameplayApi.getAll();
      setGameplays(data || []);
    } catch (error) {
      console.error('Failed to fetch gameplays');
    } finally {
      setLoading(false);
    }
  };

  const filteredGameplays = selectedMode
    ? gameplays.filter((g) => g.gameMode === selectedMode)
    : gameplays;

  const gameModes = [
    { id: 'survival', name: '生存模式', icon: '⚔️' },
    { id: 'creative', name: '创造模式', icon: '🏰' },
    { id: 'adventure', name: '冒险模式', icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen py-20 bg-grid">
      <div className="container-custom">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">玩法内容</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            探索我们服务器提供的多样化游戏玩法，找到适合你的冒险方式
          </p>
        </motion.div>

        {/* 模式筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedMode(null)}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
              selectedMode === null
                ? 'bg-minecraft-green text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            全部玩法
          </button>
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedMode === mode.id
                  ? 'bg-minecraft-green text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span>{mode.icon}</span>
              {mode.name}
            </button>
          ))}
        </motion.div>

        {/* 玩法列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredGameplays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGameplays.map((gameplay, index) => (
              <motion.div
                key={gameplay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-minecraft-green/20 rounded-xl flex items-center justify-center text-2xl">
                      {gameplay.icon || gameModeIcons[gameplay.gameMode] || '🎮'}
                    </div>
                    {gameplay.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        推荐
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{gameplay.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">
                    {gameplay.description}
                  </p>

                  {gameplay.gameMode && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300">
                        {gameplay.gameMode === 'survival' && '生存模式'}
                        {gameplay.gameMode === 'creative' && '创造模式'}
                        {gameplay.gameMode === 'adventure' && '冒险模式'}
                        {gameplay.gameMode === 'spectator' && '旁观模式'}
                      </span>
                    </div>
                  )}

                  {gameplay.detailedContent && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {gameplay.detailedContent.substring(0, 150)}...
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无玩法内容</p>
          </div>
        )}

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <GlassCard className="p-8 text-center" hover={false}>
            <h3 className="text-xl font-bold text-white mb-4">想要了解更多?</h3>
            <p className="text-gray-400 mb-6">
              加入我们的服务器，亲身体验这些精彩的游戏玩法！
              <br />
              如有任何问题，可以查看常见问题页面或联系管理员。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/qa"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                常见问题
              </a>
              <a
                href="/server-info"
                className="glass-button"
              >
                立即加入
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
