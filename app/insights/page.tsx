"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  LightBulbIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const insights = [
  {
    id: 1,
    title: "Page Speed Optimization Opportunity",
    description: "Several pages have loading times exceeding 3 seconds",
    category: "Performance",
    impact: "High",
    confidence: 95,
    action: "Optimize images and enable compression",
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "Missing Meta Descriptions",
    description: "12 pages lack compelling meta descriptions",
    category: "On-Page SEO",
    impact: "Medium",
    confidence: 88,
    action: "Write unique meta descriptions",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    id: 3,
    title: "Internal Linking Gaps",
    description: "Opportunity to improve internal link structure",
    category: "Technical SEO",
    impact: "Medium",
    confidence: 82,
    action: "Add strategic internal links",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 4,
    title: "Content Gap Analysis",
    description: "Competitors rank for keywords you're missing",
    category: "Content Strategy",
    impact: "High",
    confidence: 91,
    action: "Create content for target keywords",
    gradient: "from-purple-500 to-pink-500"
  }
]

const stats = [
  { label: "Total Insights", value: "24", icon: LightBulbIcon },
  { label: "High Impact", value: "8", icon: ArrowTrendingUpIcon },
  { label: "Implemented", value: "12", icon: SparklesIcon },
  { label: "Success Rate", value: "94%", icon: ChartBarIcon }
]

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">AI-Powered Insights</h1>
          <p className="text-muted-foreground mt-2">
            Intelligent recommendations to improve your SEO performance
          </p>
        </div>
        <Button className="mt-4 lg:mt-0 btn-premium">
          <SparklesIcon className="h-5 w-5 mr-2" />
          Generate New Insights
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-premium border-0 shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 p-3 rounded-xl">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {insight.category}
                      </Badge>
                      <Badge 
                        variant={insight.impact === 'High' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {insight.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {insight.description}
                    </CardDescription>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-2 rounded-lg">
                    <LightBulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Score</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${insight.gradient} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Recommended Action:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {insight.action}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Implement
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Features */}
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
        <CardContent className="p-8 text-center">
          <SparklesIcon className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            More AI Features Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Advanced predictive analytics, automated SEO recommendations, and intelligent content suggestions 
            powered by our 140+ factor analysis engine.
          </p>
          <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/50">
            Join Waitlist
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}