'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Trophy, Newspaper, Gamepad2 } from 'lucide-react';
import ServerStatus from '@/components/ServerStatus';
import GlassCard from '@/components/GlassCard';
import { newsApi, announcementApi, leaderboardApi } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newsData, announcementData, leaderboardData] = await Promise.all([
        newsApi.getLatest(3).catch(() => []),
        announcementApi.getLatest(3).catch(() => []),
        leaderboardApi.getPlaytime(5).catch(() => []),
      ]);
      setNews(newsData || []);
      setAnnouncements(announcementData || []);
      setLeaderboard(leaderboardData || []);
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a2e]" />
        
        <div className="container-custom relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="minecraft-title mb-6">
              Minecraft Server
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              开启你的方块冒险之旅
              <br />
              <span className="text-minecraft-green">探索、建造、生存</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/server-info"
                className="glass-button flex items-center justify-center gap-2 btn-hover-effect"
              >
                <Gamepad2 size={20} />
                立即加入
              </Link>
              <Link
                href="/gameplay"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                了解更多
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* 装饰方块 */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-minecraft-green/20 rounded-lg animate-float" />
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-minecraft-green/30 rounded-lg animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-20 w-8 h-8 bg-minecraft-green/10 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </section>

      {/* 主要内容区 */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧 - 服务器状态和排行榜 */}
          <div className="lg:col-span-1 space-y-8">
            <ServerStatus />

            {/* 排行榜 */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                游戏时长排行
              </h3>
              <div className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((player: any, index: number) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-black/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-white/10 text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white">{player.minecraftUsername || player.username}</span>
                      </div>
                      <span className="text-minecraft-green text-sm">
                        {formatTime(player.playTime)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">暂无数据</p>
                )}
              </div>
              <Link
                href="/leaderboard"
                className="block text-center text-minecraft-green hover:underline mt-4 text-sm"
              >
                查看完整排行榜
              </Link>
            </GlassCard>
          </div>

          {/* 右侧 - 公告和新闻 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 公告 */}
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-minecraft-green" />
                最新公告
              </h3>
              <div className="space-y-3">
                {announcements.length > 0 ? (
                  announcements.map((announcement: any) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        announcement.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                        announcement.type === 'error' ? 'bg-red-500/10 border-red-500' :
                        announcement.type === 'success' ? 'bg-green-500/10 border-green-500' :
                        'bg-blue-500/10 border-blue-500'
                      }`}
                    >
                      <h4 className="text-white font-medium mb-1">{announcement.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-2">{announcement.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">暂无公告</p>
                )}
              </div>
            </GlassCard>

            {/* 新闻列表 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">最新动态</h3>
                <Link href="/news" className="text-minecraft-green hover:underline text-sm">
                  查看全部
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.length > 0 ? (
                  news.map((item: any, index: number) => (
                    <GlassCard key={item.id} className="p-5" delay={index * 0.1}>
                      <h4 className="text-white font-medium mb-2 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {item.summary || item.content?.substring(0, 100)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(item.createdAt)}</span>
                        <span>{item.viewCount || 0} 阅读</span>
                      </div>
                    </GlassCard>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-2 text-center py-8">暂无新闻</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">服务器特色</h2>
          <p className="section-subtitle">探索我们提供的精彩内容</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '⚔️', title: '生存冒险', desc: '原版生存体验，挑战自我' },
            { icon: '🏰', title: '创造空间', desc: '释放创造力，建造梦想' },
            { icon: '🏝️', title: '空岛挑战', desc: '从零开始的极限生存' },
            { icon: '🐉', title: '末地探险', desc: '组队挑战末影龙' },
          ].map((feature, index) => (
            <GlassCard key={index} className="p-6 text-center" delay={index * 0.1}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
