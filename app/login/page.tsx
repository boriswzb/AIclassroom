'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError('发送验证码失败，请重试')
      } else {
        setSent(true)
      }
    } catch {
      setError('发送验证码失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-space-900 via-space-800 to-space-900 dark:from-space-950 dark:via-space-900 dark:to-space-950 p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ai-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-purple/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI 课堂
          </h1>
          <p className="text-slate-400">
            登录以访问您的个人空间
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 dark:bg-space-800/50 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-ai-cyan/20 p-8 shadow-2xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                验证码已发送
              </h2>
              <p className="text-slate-400 mb-6">
                我们已向 <span className="text-ai-cyan">{email}</span> 发送了登录验证码
              </p>
              <p className="text-sm text-slate-500">
                请查收邮件并点击验证码完成登录
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-ai-cyan hover:underline text-sm"
              >
                使用其他邮箱登录
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 dark:bg-space-900/50 border border-white/10 dark:border-ai-cyan/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-ai-cyan/50 focus:border-ai-cyan/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-ai-cyan to-ai-blue hover:from-ai-cyan/90 hover:to-ai-blue/90 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    发送登录验证码
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          登录即表示同意我们的服务条款
        </p>
      </motion.div>
    </div>
  )
}