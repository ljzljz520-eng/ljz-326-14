'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/LoadingSpinner';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justReset = searchParams.get('reset') === 'success';
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 从重置页跳转回来时，明确提示需要用新密码重新登录（仅一次）
  useEffect(() => {
    if (justReset) {
      toast.success('密码已重置，请使用新密码重新登录');
    }
  }, [justReset]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response: any = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      toast.success('登录成功');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          {justReset && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
            >
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
              <span>
                密码重置成功！请使用<span className="font-semibold">新密码</span>登录，
                您需要手动登录后才会进入账户。
              </span>
            </motion.div>
          )}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-minecraft-green rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">MC</span>
            </div>
            <h1 className="text-2xl font-bold text-white">欢迎回来</h1>
            <p className="text-gray-400 mt-2">登录您的账户继续冒险</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-white/10 text-minecraft-green focus:ring-minecraft-green"
                />
                <span className="ml-2 text-sm text-gray-400">记住我</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-minecraft-green hover:underline">
                忘记密码?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : '登录'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            还没有账户?{' '}
            <Link href="/register" className="text-minecraft-green hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
