"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  RocketLaunchIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { 
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid
} from '@heroicons/react/24/solid'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const recentAudits = [
  {
    id: 1,
    url: 'example.com',
    score: 85,
    status: 'completed',
    timestamp: '2 hours ago',
    issues: 23,
    improvements: 15
  },
  {
    id: 2,
    url: 'demo-site.com',
    score: 72,
    status: 'completed',
    timestamp: '5 hours ago',
    issues: 31,
    improvements: 22
  },
  {
    id: 3,
    url: 'client-website.org',
    score: 0,
    status: 'running',
    timestamp: 'Running...',
    issues: 0,
    improvements: 0
  }
]

const quickStats = [
  {
    label: 'Total Audits',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: DocumentMagnifyingGlassIconSolid,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    label: 'Avg Score',
    value: '78.5',
    change: '+5.2%',
    trend: 'up',
    icon: ChartBarIconSolid,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    label: 'Active Projects',
    value: '42',
    change: '+18%',
    trend: 'up',
    icon: RocketLaunchIconSolid,
    color: 'from-purple-500 to-pink-600'
  }
]

export default function HomePage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 lg:p-12"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 space-y-6 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2"
            >
              <SparklesIcon className="h-6 w-6 text-blue-200" />
              <span className="text-blue-200 font-medium">Professional SEO Analysis Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold leading-tight"
            >
              Dominate Search Rankings with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                140+ Factor Analysis
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-blue-100 max-w-2xl"
            >
              The most sophisticated SEO audit platform with AI-powered insights, real-time analysis, and enterprise-grade reporting. Outrank your competition with data-driven precision.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/auditor">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <RocketLaunchIcon className="mr-2 h-5 w-5" />
                  Start Free Audit
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <ChartBarIcon className="mr-2 h-5 w-5" />
                  View Analytics
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:flex-shrink-0 lg:ml-12 mt-8 lg:mt-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-white">140+</div>
                  <div className="text-blue-200">SEO Factors Analyzed</div>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <Card className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Audits */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Audits</CardTitle>
                  <CardDescription>Your latest SEO analysis results</CardDescription>
                </div>
                <Link href="/auditor">
                  <Button size="sm" className="btn-premium">
                    <DocumentMagnifyingGlassIcon className="mr-2 h-4 w-4" />
                    New Audit
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAudits.map((audit, index) => (
                <motion.div
                  key={audit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      audit.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-950/50' 
                        : 'bg-blue-100 dark:bg-blue-950/50'
                    }`}>
                      {audit.status === 'completed' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {audit.url}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{audit.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {audit.status === 'completed' ? (
                      <>
                        <div className={`text-2xl font-bold ${
                          audit.score >= 80 ? 'text-green-600 dark:text-green-400' :
                          audit.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                          'text-amber-600 dark:text-amber-400'
                        }`}>
                          {audit.score}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {audit.issues} issues found
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">Analyzing...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/auditor">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Run SEO Audit
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Comprehensive 140+ factor analysis
                        </p>
                      </div>
                      <BoltIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/projects">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <ChartBarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Manage Projects
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Track website performance over time
                        </p>
                      </div>
                      <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/insights">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <SparklesIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          AI Insights
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get strategic recommendations from SEO Buddy
                        </p>
                      </div>
                      <EyeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}