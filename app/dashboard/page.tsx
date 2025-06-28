"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChartBarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  UsersIcon,
  GlobeAltIcon,
  BoltIcon,
  SparklesIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline'
import { 
  ChartBarIcon as ChartBarIconSolid,
  TrophyIcon as TrophyIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid
} from '@heroicons/react/24/solid'

// Mock data for dashboard
const executiveMetrics = {
  overallPerformance: {
    score: 78.5,
    change: +5.2,
    trend: 'up',
    period: '30 days'
  },
  totalProjects: {
    count: 42,
    active: 38,
    completed: 4,
    change: +18
  },
  auditsCompleted: {
    count: 1247,
    thisMonth: 89,
    change: +12
  },
  issuesResolved: {
    count: 342,
    pending: 67,
    change: +23
  }
}

const recentActivity = [
  {
    id: 1,
    type: 'audit_completed',
    title: 'SEO Audit completed for example.com',
    description: 'Score improved from 72 to 85 (+13 points)',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'issue_detected',
    title: 'Critical issue detected on client-website.org',
    description: 'Meta descriptions missing on 15 pages',
    time: '4 hours ago',
    status: 'warning'
  },
  {
    id: 3,
    type: 'project_created',
    title: 'New project added: Local Business Site',
    description: 'Scheduled for weekly audits starting tomorrow',
    time: '6 hours ago',
    status: 'info'
  },
  {
    id: 4,
    type: 'team_member',
    title: 'Sarah Johnson joined your team',
    description: 'Added as SEO Specialist with audit permissions',
    time: '1 day ago',
    status: 'success'
  }
]

const topPerformingProjects = [
  { name: 'E-commerce Store', score: 91, change: +8, url: 'example-store.com' },
  { name: 'Corporate Website', score: 87, change: +5, url: 'company.com' },
  { name: 'Local Services', score: 85, change: +3, url: 'local-services.com' },
  { name: 'Portfolio Site', score: 82, change: +12, url: 'portfolio.com' }
]

const priorityIssues = [
  {
    project: 'E-commerce Store',
    issue: 'Page Speed Optimization',
    severity: 'high',
    impact: 'Core Web Vitals failing',
    estimated_improvement: '+15 points'
  },
  {
    project: 'Corporate Blog',
    issue: 'Missing Meta Descriptions',
    severity: 'medium',
    impact: '23 pages affected',
    estimated_improvement: '+8 points'
  },
  {
    project: 'Local Business',
    issue: 'Schema Markup Issues',
    severity: 'medium',
    impact: 'Local search visibility',
    estimated_improvement: '+6 points'
  }
]

const performanceData = [
  { month: 'Jul', score: 68 },
  { month: 'Aug', score: 71 },
  { month: 'Sep', score: 74 },
  { month: 'Oct', score: 72 },
  { month: 'Nov', score: 76 },
  { month: 'Dec', score: 78.5 }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'audit_completed':
      return <ChartBarIconSolid className="h-4 w-4 text-emerald-600" />
    case 'issue_detected':
      return <ExclamationTriangleIconSolid className="h-4 w-4 text-amber-600" />
    case 'project_created':
      return <GlobeAltIcon className="h-4 w-4 text-blue-600" />
    case 'team_member':
      return <UsersIcon className="h-4 w-4 text-purple-600" />
    default:
      return <ClockIcon className="h-4 w-4 text-slate-400" />
  }
}

const getActivityBgColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/50'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/50'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/50'
    default:
      return 'bg-slate-50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/50'
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <ChartBarIconSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">Executive Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Strategic SEO performance insights and analytics
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            <ClockIcon className="h-3 w-3" />
            <span>Updated 5 min ago</span>
          </Badge>
          <Button className="btn-premium">
            <DocumentTextIcon className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Overall Performance</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {executiveMetrics.overallPerformance.score}
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                    +{executiveMetrics.overallPerformance.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">vs last {executiveMetrics.overallPerformance.period}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                <TrophyIconSolid className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {executiveMetrics.totalProjects.active}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                    +{executiveMetrics.totalProjects.change}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">of {executiveMetrics.totalProjects.count} total</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Audits This Month</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {executiveMetrics.auditsCompleted.thisMonth}
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                    +{executiveMetrics.auditsCompleted.change}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{executiveMetrics.auditsCompleted.count} total completed</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Issues Resolved</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {executiveMetrics.issuesResolved.count}
                  </p>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                    +{executiveMetrics.issuesResolved.change}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{executiveMetrics.issuesResolved.pending} pending</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
                  <CardDescription>Latest updates across your projects</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${getActivityBgColor(activity.status)} transition-all duration-200 hover:shadow-lg cursor-pointer`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Projects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Top Performing Projects</CardTitle>
              <CardDescription>Highest scoring websites this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPerformingProjects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {project.url}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {project.score}
                      </span>
                      <div className="flex items-center space-x-1">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">
                          +{project.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Priority Issues & AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="issues">Priority Issues</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <ExclamationTriangleIconSolid className="h-5 w-5 text-amber-600" />
                  <span>Priority Issues Requiring Attention</span>
                </CardTitle>
                <CardDescription>Critical issues that could impact your SEO performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priorityIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl border ${
                      issue.severity === 'high' 
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/50'
                        : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">
                            {issue.issue}
                          </h3>
                          <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'}>
                            {issue.severity} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Project: <span className="font-medium">{issue.project}</span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Impact: {issue.impact}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {issue.estimated_improvement}
                        </div>
                        <div className="text-xs text-muted-foreground">potential gain</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <SparklesIcon className="h-5 w-5 text-blue-600" />
                  <span>AI-Powered Strategic Insights</span>
                </CardTitle>
                <CardDescription>Smart recommendations based on your portfolio analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                      <BoltIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Focus on Core Web Vitals Optimization
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200">
                        67% of your projects could benefit from improved Core Web Vitals. This represents the highest 
                        potential impact area with an estimated +12 point average improvement across your portfolio.
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CursorArrowRaysIcon className="mr-2 h-4 w-4" />
                        View Optimization Guide
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl">
                      <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                        Content Strategy Opportunities
                      </h3>
                      <p className="text-emerald-800 dark:text-emerald-200">
                        Your content quality scores show strong potential. Consider implementing structured data 
                        and improving E-E-A-T signals across 15 key pages for maximum search visibility impact.
                      </p>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <DocumentTextIcon className="mr-2 h-4 w-4" />
                        Generate Content Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}