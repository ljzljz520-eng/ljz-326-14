'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, HelpCircle, Tag } from 'lucide-react';
import { qaApi } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import { SkeletonCard } from '@/components/LoadingSpinner';

export default function QAPage() {
  const [qas, setQas] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [qaData, categoryData] = await Promise.all([
        qaApi.getAll(),
        qaApi.getCategories(),
      ]);
      setQas(qaData || []);
      setCategories(categoryData || []);
    } catch (error) {
      console.error('Failed to fetch QA data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const data = await qaApi.search(searchKeyword);
      setQas(data || []);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string | null) => {
    setSelectedCategory(category);
    setSearchKeyword('');
    
    if (!category) {
      fetchData();
      return;
    }

    setLoading(true);
    try {
      const data = await qaApi.getByCategory(category);
      setQas(data || []);
    } catch (error) {
      console.error('Failed to filter by category');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
          <h1 className="text-4xl font-bold text-white mb-4">常见问题</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            在这里找到你需要的答案，如果没有找到，可以联系管理员获取帮助
          </p>
        </motion.div>

        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索问题..."
                className="glass-input pl-12 pr-24"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-minecraft-green hover:bg-minecraft-darkGreen text-white text-sm rounded-lg transition-colors"
              >
                搜索
              </button>
            </div>
          </div>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === null
                ? 'bg-minecraft-green text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Tag size={14} />
            全部分类
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-minecraft-green text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 问答列表 */}
        {loading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : qas.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {qas.map((qa, index) => (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <button
                    onClick={() => toggleExpand(qa.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-minecraft-green flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-medium">{qa.question}</h3>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400">
                          {qa.category}
                        </span>
                      </div>
                    </div>
                    {expandedId === qa.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedId === qa.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="p-4 bg-black/20 rounded-lg border-l-4 border-minecraft-green">
                            <p className="text-gray-300 whitespace-pre-line">
                              {qa.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchKeyword ? '没有找到相关问题' : '暂无问答内容'}
            </p>
          </div>
        )}

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <GlassCard className="p-8 max-w-2xl mx-auto" hover={false}>
            <h3 className="text-xl font-bold text-white mb-2">没有找到答案?</h3>
            <p className="text-gray-400 mb-4">
              如果以上问答没有解决你的问题，可以通过以下方式联系我们
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>QQ群: 123456789</span>
              <span>|</span>
              <span>邮箱: support@minecraft.com</span>
              <span>|</span>
              <span>Discord: minecraft-server</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
