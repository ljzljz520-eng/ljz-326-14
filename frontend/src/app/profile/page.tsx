'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Gamepad2, Clock, Trophy, Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatTime, formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    minecraftUsername: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
      setFormData({
        minecraftUsername: (data as any).minecraftUsername || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await userApi.updateProfile(formData);
      updateUser(data as any);
      setProfile(data);
      setEditing(false);
      toast.success('保存成功');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 bg-grid">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 头部信息 */}
          <GlassCard className="p-8 mb-8" hover={false}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-minecraft-green rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail size={16} />
                  {user.email}
                </p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                    管理员
                  </span>
                )}
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Edit2 size={16} />
                编辑资料
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 游戏数据 */}
            <GlassCard className="p-6" hover={false}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-minecraft-green" />
                游戏数据
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">游戏时长</span>
                  </div>
                  <span className="text-minecraft-green font-medium">
                    {formatTime(profile?.playTime || user?.playTime || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">成就数量</span>
                  </div>
                  <span className="text-yellow-400 font-medium">
                    {profile?.achievements || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">MC用户名</span>
                  </div>
                  <span className="text-white font-medium">
                    {profile?.minecraftUsername || '未绑定'}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* 账户信息 */}
            <GlassCard className="p-6" hover={false}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-minecraft-green" />
                账户信息
              </h2>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Minecraft用户名</label>
                    <input
                      type="text"
                      value={formData.minecraftUsername}
                      onChange={(e) => setFormData({ ...formData, minecraftUsername: e.target.value })}
                      className="glass-input"
                      placeholder="你的MC用户名"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full glass-button flex items-center justify-center gap-2"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : (
                      <>
                        <Save size={16} />
                        保存修改
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">注册时间</p>
                    <p className="text-white">{formatDate(profile?.createdAt || new Date())}</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">最后登录</p>
                    <p className="text-white">{formatDate(profile?.lastLoginAt || new Date())}</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">邮箱验证</p>
                    <p className={profile?.emailVerified ? 'text-green-400' : 'text-yellow-400'}>
                      {profile?.emailVerified ? '已验证' : '未验证'}
                    </p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
