import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserMenu } from '@/components/user-menu'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/login')
  }

  // Get full user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 dark:from-space-950 dark:via-space-900 dark:to-space-950">
      {/* User Header */}
      <header className="sticky top-0 z-50 bg-white/5 dark:bg-space-800/50 backdrop-blur-xl border-b border-white/10 dark:border-ai-cyan/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">AI 课堂</span>
            <span className="text-xs text-slate-400">我的空间</span>
          </a>
          <UserMenu user={user} />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}