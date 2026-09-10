'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Clock, Copy, Check, Wifi } from 'lucide-react';
import { serverApi } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import toast from 'react-hot-toast';

const timelineData = [
  { date: '2023-01', event: '服务器正式上线', icon: '🚀' },
  { date: '2023-06', event: '首次版本大更新', icon: '⬆️' },
  { date: '2023-09', event: '玩家突破1000人', icon: '🎉' },
  { date: '2024-01', event: '推出空岛玩法', icon: '🏝️' },
  { date: '2024-06', event: '服务器硬件升级', icon: '💪' },
];

const hardwareSpecs = [
  { label: 'CPU', value: 'Intel Xeon E5-2690 v4', icon: Cpu },
  { label: '内存', value: '64GB DDR4 ECC', icon: HardDrive },
  { label: '存储', value: '1TB NVMe SSD', icon: HardDrive },
  { label: '带宽', value: '1Gbps 独享', icon: Wifi },
];

export default function ServerInfoPage() {
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    try {
      const data = await serverApi.getInfo();
      setServerInfo(data);
    } catch (error) {
      console.error('Failed to fetch server info');
    }
  };

  const copyIP = async () => {
    if (serverInfo?.serverIp) {
      await navigator.clipboard.writeText(serverInfo.serverIp);
      setCopied(true);
      toast.success('IP已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-grid">
      <div className="container-custom">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">服务器介绍</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            了解我们服务器的详细信息，包括连接方式、硬件配置和发展历程
          </p>
        </motion.div>

        {/* 连接信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard className="p-8" hover={false}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-minecraft-green/20 rounded-xl flex items-center justify-center">
                  <Server className="w-8 h-8 text-minecraft-green" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">服务器地址</h2>
                  <p className="text-gray-400">点击复制IP地址加入游戏</p>
                </div>
              </div>

              <button
                onClick={copyIP}
                className="flex items-center gap-3 px-6 py-4 bg-black/30 rounded-xl hover:bg-black/40 transition-colors group"
              >
                <span className="text-minecraft-green font-mono text-2xl">
                  {serverInfo?.serverIp || 'mc.example.com'}
                </span>
                {copied ? (
                  <Check className="w-6 h-6 text-green-400" />
                ) : (
                  <Copy className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">游戏版本</p>
                <p className="text-white font-semibold">{serverInfo?.version || '1.20.4'}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">在线玩家</p>
                <p className="text-minecraft-green font-semibold">
                  {serverInfo?.onlinePlayers || 0} / {serverInfo?.maxPlayers || 100}
                </p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">服务器TPS</p>
                <p className="text-green-400 font-semibold">{serverInfo?.tps?.toFixed(1) || '20.0'}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">服务器状态</p>
                <p className={`font-semibold ${serverInfo?.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {serverInfo?.isOnline ? '在线' : '离线'}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 硬件配置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">硬件配置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hardwareSpecs.map((spec, index) => (
              <GlassCard key={index} className="p-6" delay={index * 0.05}>
                <spec.icon className="w-8 h-8 text-minecraft-green mb-4" />
                <p className="text-gray-400 text-sm mb-1">{spec.label}</p>
                <p className="text-white font-semibold">{spec.value}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* 发展时间线 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-minecraft-green" />
            发展历程
          </h2>
          <GlassCard className="p-8" hover={false}>
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-minecraft-green/30" />
              
              <div className="space-y-8">
                {timelineData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 w-8 h-8 bg-minecraft-green rounded-full flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-minecraft-green text-sm font-medium">{item.date}</p>
                      <p className="text-white font-semibold mt-1">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
