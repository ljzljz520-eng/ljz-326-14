'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Server, Wifi, WifiOff, Copy, Check } from 'lucide-react';
import { serverApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ServerInfo {
  serverIp: string;
  serverPort: number;
  version: string;
  isOnline: boolean;
  onlinePlayers: number;
  maxPlayers: number;
  motd: string;
  tps: number;
}

export default function ServerStatus() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchServerInfo();
    const interval = setInterval(fetchServerInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchServerInfo = async () => {
    try {
      const data = await serverApi.getInfo();
      setServerInfo(data);
    } catch (error) {
      console.error('Failed to fetch server info');
    } finally {
      setLoading(false);
    }
  };

  const copyIP = async () => {
    if (serverInfo) {
      await navigator.clipboard.writeText(serverInfo.serverIp);
      setCopied(true);
      toast.success('IP地址已复制');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }

  if (!serverInfo) {
    return (
      <div className="glass-card p-6 text-center">
        <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-2" />
        <p className="text-gray-400">无法获取服务器状态</p>
      </div>
    );
  }

  const playerPercentage = (serverInfo.onlinePlayers / serverInfo.maxPlayers) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* 状态指示 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-minecraft-green" />
          服务器状态
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
          serverInfo.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {serverInfo.isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span className="text-sm font-medium">
            {serverInfo.isOnline ? '在线' : '离线'}
          </span>
        </div>
      </div>

      {/* 服务器IP */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-1">服务器地址</p>
        <button
          onClick={copyIP}
          className="w-full flex items-center justify-between bg-black/30 rounded-lg px-4 py-3 hover:bg-black/40 transition-colors group"
        >
          <span className="text-minecraft-green font-mono text-lg">
            {serverInfo.serverIp}
          </span>
          {copied ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} className="text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* 在线人数 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <Users size={14} />
            在线玩家
          </p>
          <span className="text-white font-medium">
            {serverInfo.onlinePlayers} / {serverInfo.maxPlayers}
          </span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${playerPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-minecraft-green to-minecraft-lightGreen rounded-full"
          />
        </div>
      </div>

      {/* 其他信息 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-gray-400 mb-1">游戏版本</p>
          <p className="text-white font-medium">{serverInfo.version}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-gray-400 mb-1">服务器TPS</p>
          <p className={`font-medium ${
            serverInfo.tps >= 18 ? 'text-green-400' : 
            serverInfo.tps >= 15 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {serverInfo.tps.toFixed(1)}
          </p>
        </div>
      </div>

      {/* MOTD */}
      {serverInfo.motd && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg">
          <p className="text-gray-300 text-sm text-center">{serverInfo.motd}</p>
        </div>
      )}
    </motion.div>
  );
}
