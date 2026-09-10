'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound, Link2, Send } from 'lucide-react';
import { authApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const forgotPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  // 账号不存在时的内联错误（与其他网络错误区分开）
  const [notFound, setNotFound] = useState(false);
  // 开发模式下后端会直接返回链接和验证码（没有真实邮件服务）
  const [devResetLink, setDevResetLink] = useState('');
  const [devCode, setDevCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    setNotFound(false);
    try {
      const res: any = await authApi.forgotPassword(data);
      setSentEmail(data.email);
      setDevResetLink(res.resetLink ? `${res.resetLink}` : '');
      setDevCode(res.resetCode ?? '');
      setSubmitted(true);
    } catch (error: any) {
      // 账号不存在：单独提示，引导注册，而不是笼统的发送失败
      const message: string =
        error?.response?.data?.message || '';
      if (error?.response?.status === 404 || message.includes('未注册')) {
        setNotFound(true);
      }
      // 其余错误由全局 axios 拦截器统一 toast 提示
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
            <h1 className="text-2xl font-bold text-white mb-2">重置信息已发送</h1>
            <p className="text-gray-400 mb-6">
              我们已向 <span className="text-white font-medium">{sentEmail}</span> 发送了密码重置链接和验证码，
              链接与验证码 <span className="text-yellow-400">1 小时内有效</span>。
              <br />
              如果没有收到邮件，请检查垃圾邮件文件夹。
            </p>

            {/* 开发模式：直接展示重置入口（生产环境由邮件承载，可删除此区块） */}
            {(devResetLink || devCode) && (
              <div className="mb-6 p-4 rounded-lg bg-black/30 border border-white/10 text-left space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  开发模式（未接入真实邮件服务）
                </p>
                {devCode && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-400">
                      验证码：<span className="text-lg font-mono font-bold text-minecraft-green tracking-widest">{devCode}</span>
                    </span>
                    <button
                      onClick={() => router.push(`/reset-password?email=${encodeURIComponent(sentEmail)}`)}
                      className="inline-flex items-center gap-1 text-sm text-minecraft-green hover:underline whitespace-nowrap"
                    >
                      <KeyRound size={14} />
                      用验证码重置
                    </button>
                  </div>
                )}
                {devResetLink && (
                  <button
                    onClick={() => router.push(devResetLink)}
                    className="inline-flex items-center gap-1 text-sm text-minecraft-green hover:underline"
                  >
                    <Link2 size={14} />
                    打开重置链接
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-minecraft-green hover:underline"
              >
                <ArrowLeft size={16} />
                返回登录
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDevCode('');
                  setDevResetLink('');
                }}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Send size={14} />
                重新发送
              </button>
            </div>
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
            <p className="text-gray-400 mt-2">输入您的邮箱，我们将发送重置链接和验证码</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email', {
                    // 通过 register 选项挂载自定义 onChange，
                    // 避免覆盖 RHF 内部的 onChange 导致拿不到输入值
                    onChange: () => setNotFound(false),
                  })}
                  type="email"
                  className="glass-input pl-10"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
              {notFound && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-start gap-2 text-sm text-amber-400"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    该邮箱尚未注册，请确认邮箱是否输入正确，或{' '}
                    <Link href="/register" className="underline hover:text-amber-300">
                      立即注册
                    </Link>
                    。
                  </span>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : '发送重置链接和验证码'}
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
