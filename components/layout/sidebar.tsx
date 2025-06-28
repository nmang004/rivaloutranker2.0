"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  FolderIcon as FolderIconSolid,
  UsersIcon as UsersIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  LightBulbIcon as LightBulbIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid,
    gradient: 'from-blue-500 to-indigo-600'
  },
  { 
    name: 'SEO Auditor', 
    href: '/auditor', 
    icon: DocumentMagnifyingGlassIcon, 
    iconSolid: DocumentMagnifyingGlassIconSolid,
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard', 
    icon: ChartBarIcon, 
    iconSolid: ChartBarIconSolid,
    gradient: 'from-emerald-500 to-teal-600'
  },
  { 
    name: 'Projects', 
    href: '/projects', 
    icon: FolderIcon, 
    iconSolid: FolderIconSolid,
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: DocumentTextIcon, 
    iconSolid: DocumentTextIconSolid,
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    name: 'AI Insights', 
    href: '/insights', 
    icon: LightBulbIcon, 
    iconSolid: LightBulbIconSolid,
    gradient: 'from-violet-500 to-purple-600'
  },
  { 
    name: 'Teams', 
    href: '/teams', 
    icon: UsersIcon, 
    iconSolid: UsersIconSolid,
    gradient: 'from-rose-500 to-pink-600'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon, 
    iconSolid: Cog6ToothIconSolid,
    gradient: 'from-slate-500 to-gray-600'
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60">
        {/* Logo Section */}
        <div className="flex items-center justify-center px-6 py-8 border-b border-slate-200/60 dark:border-slate-700/60">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <RocketLaunchIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">RivalOutRanker</span>
              <span className="text-xs text-muted-foreground font-medium">Professional SEO Platform</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = isActive ? item.iconSolid : item.icon
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                  style={isActive ? { 
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` 
                  } : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn("absolute inset-0 bg-gradient-to-r", item.gradient)}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative flex items-center space-x-3",
                    isActive ? "text-white" : ""
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    )} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      className="absolute right-3"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                    >
                      <SparklesIcon className="h-4 w-4 text-white/80" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-6 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  140+ Factor Analysis
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  Industry-leading algorithm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}