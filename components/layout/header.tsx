"use client"

import { motion } from 'framer-motion'
import { useWebSocketContext } from '@/components/providers/websocket-provider'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { isConnected, connectionError } = useWebSocketContext()

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button variant="ghost" size="sm">
            <Bars3Icon className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search audits, projects, or insights..."
              className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* WebSocket Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected 
                ? 'bg-emerald-500 animate-pulse' 
                : connectionError 
                  ? 'bg-red-500' 
                  : 'bg-amber-500'
            }`}></div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {isConnected ? 'Live' : connectionError ? 'Offline' : 'Connecting...'}
            </span>
          </div>
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
                <BellIcon className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 hover:bg-red-500 border-white dark:border-slate-900">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">You have 3 new notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Audit completed for example.com
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Your comprehensive SEO audit is ready for review
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">2 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        New team member added
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Sarah Johnson joined your SEO team
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Monthly report generated
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Your December SEO performance report is available
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" size="sm" className="w-full justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">NM</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Nick Mangubat</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    nick@rivaloutranker.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircleIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}