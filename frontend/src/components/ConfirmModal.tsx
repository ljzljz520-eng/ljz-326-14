'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = '确认操作',
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const typeStyles = {
    warning: {
      icon: 'text-yellow-400',
      confirmBtn: 'bg-yellow-500 hover:bg-yellow-600',
    },
    danger: {
      icon: 'text-red-400',
      confirmBtn: 'bg-red-500 hover:bg-red-600',
    },
    info: {
      icon: 'text-minecraft-green',
      confirmBtn: 'bg-minecraft-green hover:bg-minecraft-darkGreen',
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden">
              {/* 顶部装饰条 */}
              <div className={`h-1 w-full ${type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-minecraft-green'}`} />
              
              {/* 关闭按钮 */}
              <button
                onClick={onCancel}
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>

              {/* 内容区域 */}
              <div className="p-6">
                {/* 图标和标题 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full bg-white/10 ${currentStyle.icon}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>

                {/* 消息内容 */}
                <p className="text-gray-300 mb-6 ml-11">{message}</p>

                {/* 按钮组 */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-200"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-4 py-2 ${currentStyle.confirmBtn} text-white rounded-lg font-medium transition-all duration-200 shadow-lg`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
