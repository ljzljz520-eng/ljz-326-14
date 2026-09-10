'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Award, Medal } from 'lucide-react';
import { leaderboardApi } from '@/lib/api';
import { formatTime } from '@/lib/utils';

interface Player {
  id: number;
  username: string;
  minecraftUsername: string;
  avatar?: string;
  playTime: number;
  achievements: number;
}

type TabType = 'playtime' | 'achievements';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TabType>('playtime');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'playtime'
        ? await leaderboardApi.getPlaytime(10)
        : await leaderboardApi.getAchievements(10);
      setPlayers(data || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        玩家排行榜
      </h3>

      {/* 切换标签 */}
      <div className="flex bg-black/30 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('playtime')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'playtime'
              ? 'bg-minecraft-green text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Clock size={16} />
          游戏时长
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'achievements'
              ? 'bg-minecraft-green text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Award size={16} />
          成就数量
        </button>
      </div>

      {/* 排行列表 */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index < 3 ? 'bg-white/10' : 'bg-white/5'
              } hover:bg-white/15 transition-colors`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              <div className="w-10 h-10 bg-minecraft-green/20 rounded-full flex items-center justify-center">
                <span className="text-minecraft-green font-bold">
                  {(player.minecraftUsername || player.username).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  {player.minecraftUsername || player.username}
                </p>
              </div>
              <div className="text-right">
                <p className="text-minecraft-green font-bold">
                  {activeTab === 'playtime'
                    ? formatTime(player.playTime)
                    : `${player.achievements} 个`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
