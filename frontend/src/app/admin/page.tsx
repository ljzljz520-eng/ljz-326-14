'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, Newspaper, HelpCircle, Bell, Gamepad2, 
  Server, Plus, Trash2, Edit, Eye, EyeOff 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { userApi, newsApi, qaApi, announcementApi, gameplayApi } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';

type TabType = 'users' | 'news' | 'qa' | 'announcements' | 'gameplay';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let result: any;
      switch (activeTab) {
        case 'users':
          result = await userApi.getAll();
          break;
        case 'news':
          result = await newsApi.getAll(true);
          break;
        case 'qa':
          result = await qaApi.getAll(true);
          break;
        case 'announcements':
          result = await announcementApi.getAll(true);
          break;
        case 'gameplay':
          result = await gameplayApi.getAll(true);
          break;
      }
      setData(result || []);
    } catch (error) {
      console.error('Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    
    try {
      switch (activeTab) {
        case 'news':
          await newsApi.delete(deleteTargetId);
          break;
        case 'qa':
          await qaApi.delete(deleteTargetId);
          break;
        case 'announcements':
          await announcementApi.delete(deleteTargetId);
          break;
        case 'gameplay':
          await gameplayApi.delete(deleteTargetId);
          break;
      }
      toast.success('删除成功');
      fetchData();
    } catch (error) {
      toast.error('删除失败');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const tabs = [
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'news', label: '新闻管理', icon: Newspaper },
    { id: 'qa', label: '问答管理', icon: HelpCircle },
    { id: 'announcements', label: '公告管理', icon: Bell },
    { id: 'gameplay', label: '玩法管理', icon: Gamepad2 },
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen py-20 bg-grid">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">管理后台</h1>

          {/* 标签导航 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-minecraft-green text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 内容区域 */}
          <GlassCard className="p-6" hover={false}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* 用户列表 */}
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">用户名</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">邮箱</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">MC用户名</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">角色</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">游戏时长</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item: any) => (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white">{item.id}</td>
                            <td className="py-3 px-4 text-white">{item.username}</td>
                            <td className="py-3 px-4 text-gray-300">{item.email}</td>
                            <td className="py-3 px-4 text-gray-300">{item.minecraftUsername || '-'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {item.role === 'admin' ? '管理员' : '用户'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-minecraft-green">{item.playTime}分钟</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 新闻列表 */}
                {activeTab === 'news' && (
                  <div className="space-y-4">
                    {data.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                        <div className="flex-grow">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1">{item.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.isPublished ? '已发布' : '草稿'}
                          </span>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 问答列表 */}
                {activeTab === 'qa' && (
                  <div className="space-y-4">
                    {data.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                        <div className="flex-grow">
                          <h4 className="text-white font-medium">{item.question}</h4>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 公告列表 */}
                {activeTab === 'announcements' && (
                  <div className="space-y-4">
                    {data.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                        <div className="flex-grow">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                            item.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            item.type === 'error' ? 'bg-red-500/20 text-red-400' :
                            item.type === 'success' ? 'bg-green-500/20 text-green-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 玩法列表 */}
                {activeTab === 'gameplay' && (
                  <div className="space-y-4">
                    {data.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                        <div className="flex-grow">
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {item.isFeatured && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                              推荐
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {data.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    暂无数据
                  </div>
                )}
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="确认删除"
        message="确定要删除此项吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
