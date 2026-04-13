'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { 
  LogOut, 
  Settings, 
  User,
  ChevronDown,
  LogIn
} from 'lucide-react'

interface UserMenuProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (!session) {
    return (
      <a
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-ai-cyan/20 text-ai-cyan rounded-lg hover:bg-ai-cyan/30 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        登录
      </a>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-ai-cyan/20 flex items-center justify-center">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name || ''} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-ai-cyan" />
          )}
        </div>
        <span className="text-white text-sm hidden sm:block">
          {user.name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-space-800/95 backdrop-blur-xl rounded-xl border border-ai-cyan/20 shadow-xl z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user.name || '用户'}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>

              <div className="py-2">
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  设置
                </a>
                
                <a
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  个人空间
                </a>
              </div>

              <div className="border-t border-white/10 py-2">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}