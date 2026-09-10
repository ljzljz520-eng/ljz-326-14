'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  KeyRound,
  Mail,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const resetSchema = z
  .object({
    email: z.string().email('请输入有效的邮箱地址'),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, '请输入6位数字验证码'),
    password: z
      .string()
      .min(8, '密码至少8个字符')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        '密码必须包含大小写字母、数字和特殊字符'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码输入不一致',
    path: ['confirmPassword'],
  });

type ResetForm = z.infer<typeof resetSchema>;

type LinkStatus = 'checking' | 'valid' | 'expired' | 'invalid' | 'code-mode';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailFromQuery = searchParams.get('email') || '';

  const [linkStatus, setLinkStatus] = useState<LinkStatus>(
    token ? 'checking' : 'code-mode'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  // 新旧密码相同的内联错误（单独处理，不与其他错误混为一谈）
  const [samePassword, setSamePassword] = useState(false);
  const validatedRef = useRef(false);

  // 进入页面时先校验链接 token：失效 / 过期 / 有效 三态分别展示
  useEffect(() => {
    if (!token || validatedRef.current) return;
    validatedRef.current = true;

    (async () => {
      try {
        const res = await authApi.validateResetToken(token);
        setLinkStatus(res.valid ? 'valid' : res.status === 'expired' ? 'expired' : 'invalid');
      } catch {
        setLinkStatus('invalid');
      }
    })();
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: emailFromQuery, code: '' },
  });

  useEffect(() => {
    if (emailFromQuery) setValue('email', emailFromQuery);
  }, [emailFromQuery, setValue]);

  const passwordValue = watch('password', '');
  const getStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[a-z]/.test(pwd)) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[@$!%*?&]/.test(pwd)) s++;
    return s;
  };
  const strength = getStrength(passwordValue);

  const onSubmit = useCallback(
    async (data: ResetForm) => {
      setLoading(true);
      setSamePassword(false);
      try {
        await authApi.resetPassword({
          // 链接模式带 token；验证码模式带 email + code
          ...(linkStatus === 'valid' && token
            ? { token }
            : { email: data.email, code: data.code }),
          password: data.password,
        });
        // 成功：展示成功页，引导用户重新登录；绝不自动签发会话、绝不自动进站
        setDone(true);
      } catch (error: any) {
        const message: string = error?.response?.data?.message || '';
        if (message.includes('不能与旧密码相同')) {
          setSamePassword(true);
        } else if (message.includes('过期')) {
          setLinkStatus('expired');
        } else if (message.includes('无效') && linkStatus === 'valid') {
          // 提交时 token 已失效（例如并发使用），切换到无效态
          setLinkStatus('invalid');
        }
        // 其余错误（如验证码错误）由全局 axios 拦截器统一 toast
      } finally {
        setLoading(false);
      }
    },
    [linkStatus, token]
  );

  // ---------- 重置成功：只引导重新登录，不自动进站 ----------
  if (done) {
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
            <h1 className="text-2xl font-bold text-white mb-2">密码重置成功</h1>
            <p className="text-gray-400 mb-6">
              您的新密码已生效，请使用<span className="text-white">新密码</span>重新登录。
              <br />
              出于安全考虑，您需要手动登录，系统不会自动进入账户。
            </p>
            <button
              onClick={() => router.push('/login?reset=success')}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
              前往登录
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- 链接失效（不存在/已被使用） ----------
  if (linkStatus === 'invalid') {
    return (
      <ErrorState
        icon={<ShieldAlert className="w-8 h-8 text-red-400" />}
        iconBg="bg-red-500/20"
        title="重置链接无效"
        desc="该重置链接不存在或已被使用。每个链接只能使用一次，请重新申请密码重置。"
      />
    );
  }

  // ---------- 链接过期 ----------
  if (linkStatus === 'expired') {
    return (
      <ErrorState
        icon={<AlertTriangle className="w-8 h-8 text-amber-400" />}
        iconBg="bg-amber-500/20"
        title="重置链接已过期"
        desc="重置链接和验证码的有效期为 1 小时。为保障账号安全，请重新申请一封重置邮件。"
      />
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
              <Lock className="w-8 h-8 text-minecraft-green" />
            </div>
            <h1 className="text-2xl font-bold text-white">设置新密码</h1>
            <p className="text-gray-400 mt-2">
              {linkStatus === 'checking'
                ? '正在校验重置链接…'
                : linkStatus === 'valid'
                  ? '已通过安全链接验证身份'
                  : '输入邮箱和邮件中的 6 位验证码'}
            </p>
          </div>

          {linkStatus === 'checking' ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {linkStatus !== 'valid' && (
                <>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">验证码</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        {...register('code')}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="glass-input pl-10 tracking-[0.5em] font-mono"
                        placeholder="••••••"
                      />
                    </div>
                    {errors.code && (
                      <p className="text-red-400 text-sm mt-1">{errors.code.message}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('password', {
                      // 通过 register 选项挂载自定义 onChange，
                      // 避免覆盖 RHF 内部的 onChange
                      onChange: () => setSamePassword(false),
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="glass-input pl-10 pr-10"
                    placeholder="至少8位，含大小写字母、数字和特殊字符"
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
                {samePassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-amber-400 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertTriangle size={14} />
                    新密码不能与旧密码相同，请换一个新密码
                  </motion.p>
                )}
                {passwordValue && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= strength
                            ? strength <= 2
                              ? 'bg-red-500'
                              : strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="glass-input pl-10"
                    placeholder="再次输入新密码"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full glass-button flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : '确认重置密码'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              重新获取重置链接/验证码
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ErrorState({
  icon,
  iconBg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 text-center">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {icon}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 mb-6">{desc}</p>
          <div className="flex flex-col gap-3">
            <Link href="/forgot-password" className="w-full glass-button flex items-center justify-center">
              重新申请重置
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
