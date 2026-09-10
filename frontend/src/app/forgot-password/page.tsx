'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const forgotPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data);
      setSubmitted(true);
      toast.success('重置链接已发送');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">邮件已发送</h1>
            <p className="text-gray-400 mb-6">
              请查收您的邮箱，点击邮件中的链接重置密码。
              <br />
              如果没有收到邮件，请检查垃圾邮件文件夹。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-minecraft-green hover:underline"
            >
              <ArrowLeft size={16} />
              返回登录
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-minecraft-green/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-minecraft-green" />
            </div>
            <h1 className="text-2xl font-bold text-white">忘记密码</h1>
            <p className="text-gray-400 mt-2">输入您的邮箱，我们将发送重置链接</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="glass-input pl-10"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : '发送重置链接'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              返回登录
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
