'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import { 
  BookOpen, 
  Clock, 
  Settings, 
  TrendingUp,
  Users,
  FolderOpen
} from 'lucide-react'

export default function UserDashboard() {
  const { data: session } = useSession()

  const stats = [
    { label: '创建的课堂', value: '12', icon: BookOpen, color: 'text-ai-cyan' },
    { label: '最近访问', value: '2小时前', icon: Clock, color: 'text-ai-purple' },
    { label: 'AI 生成内容', value: '48', icon: TrendingUp, color: 'text-green-400' },
    { label: '协作成员', value: '5', icon: Users, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          欢迎回来，{session?.user?.name || '用户'}
        </h1>
        <p className="text-slate-400">
          这是您的个人学习空间
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 dark:bg-space-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-ai-cyan/20 p-5"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 dark:bg-space-700/50 rounded-lg">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">快速访问</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/classroom"
            className="flex items-center gap-4 p-4 bg-white/5 dark:bg-space-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-ai-cyan/20 hover:border-ai-cyan/40 transition-all group"
          >
            <div className="p-3 bg-ai-cyan/10 rounded-lg group-hover:bg-ai-cyan/20 transition-colors">
              <FolderOpen className="w-6 h-6 text-ai-cyan" />
            </div>
            <div>
              <h3 className="font-medium text-white">我的课堂</h3>
              <p className="text-sm text-slate-400">查看和管理您的课堂</p>
            </div>
          </a>

          <a
            href="/"
            className="flex items-center gap-4 p-4 bg-white/5 dark:bg-space-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-ai-cyan/20 hover:border-ai-cyan/40 transition-all group"
          >
            <div className="p-3 bg-ai-purple/10 rounded-lg group-hover:bg-ai-purple/20 transition-colors">
              <BookOpen className="w-6 h-6 text-ai-purple" />
            </div>
            <div>
              <h3 className="font-medium text-white">创建新课程</h3>
              <p className="text-sm text-slate-400">开始新的AI课程</p>
            </div>
          </a>

          <a
            href="/settings"
            className="flex items-center gap-4 p-4 bg-white/5 dark:bg-space-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-ai-cyan/20 hover:border-ai-cyan/40 transition-all group"
          >
            <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <Settings className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">设置</h3>
              <p className="text-sm text-slate-400">账户和偏好设置</p>
            </div>
          </a>
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">最近活动</h2>
        <div className="bg-white/5 dark:bg-space-800/50 backdrop-blur-sm rounded-xl border border-white/10 dark:border-ai-cyan/20 p-6">
          <p className="text-slate-400 text-center">暂无最近活动</p>
        </div>
      </motion.div>
    </div>
  )
}