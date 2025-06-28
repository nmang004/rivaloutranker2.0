"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChartBarIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
  MapPinIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  XCircleIcon as XCircleIconSolid
} from '@heroicons/react/24/solid'

interface SEOFactor {
  id: string
  name: string
  status: 'OK' | 'OFI' | 'Priority OFI'
  score: number
  importance: 'High' | 'Medium' | 'Low'
  description: string
  recommendation: string
  category: 'content' | 'technical' | 'local' | 'ux'
}

const mockAuditResults = {
  url: 'https://example.com',
  overallScore: 73,
  timestamp: '2024-01-15T10:30:00Z',
  categories: {
    content: { score: 78, factors: 35, issues: 8 },
    technical: { score: 85, factors: 40, issues: 6 },
    local: { score: 61, factors: 35, issues: 14 },
    ux: { score: 69, factors: 30, issues: 12 }
  },
  totalFactors: 140,
  totalIssues: 40,
  priorityIssues: 12,
  opportunities: 28
}

const sampleFactors: SEOFactor[] = [
  {
    id: 'meta-title',
    name: 'Meta Title Optimization',
    status: 'Priority OFI',
    score: 45,
    importance: 'High',
    description: 'Title tag is too long and missing target keywords',
    recommendation: 'Optimize title to 50-60 characters and include primary keyword at the beginning',
    category: 'content'
  },
  {
    id: 'core-web-vitals',
    name: 'Core Web Vitals',
    status: 'OK',
    score: 92,
    importance: 'High',
    description: 'LCP: 1.8s, FID: 45ms, CLS: 0.05 - All metrics within good thresholds',
    recommendation: 'Maintain current performance optimization strategies',
    category: 'technical'
  },
  {
    id: 'local-schema',
    name: 'Local Business Schema',
    status: 'OFI',
    score: 65,
    importance: 'Medium',
    description: 'Schema markup present but missing some recommended properties',
    recommendation: 'Add opening hours, payment methods, and service area to schema markup',
    category: 'local'
  },
  {
    id: 'mobile-usability',
    name: 'Mobile Usability',
    status: 'OFI',
    score: 72,
    importance: 'High',
    description: 'Touch elements are slightly too close together on mobile',
    recommendation: 'Increase spacing between clickable elements to 44px minimum',
    category: 'ux'
  }
]

const categoryConfig = {
  content: {
    name: 'Content Quality',
    icon: GlobeAltIcon,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
    borderColor: 'border-blue-200/50 dark:border-blue-800/50'
  },
  technical: {
    name: 'Technical SEO',
    icon: CpuChipIcon,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    borderColor: 'border-emerald-200/50 dark:border-emerald-800/50'
  },
  local: {
    name: 'Local SEO',
    icon: MapPinIcon,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    borderColor: 'border-amber-200/50 dark:border-amber-800/50'
  },
  ux: {
    name: 'UX Performance',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
    borderColor: 'border-purple-200/50 dark:border-purple-800/50'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-blue-600 dark:text-blue-400'
  if (score >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/50'
  if (score >= 60) return 'bg-blue-50 dark:bg-blue-950/50'
  if (score >= 40) return 'bg-amber-50 dark:bg-amber-950/50'
  return 'bg-red-50 dark:bg-red-950/50'
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'OK':
      return <CheckCircleIconSolid className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    case 'OFI':
      return <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    case 'Priority OFI':
      return <ExclamationTriangleIconSolid className="h-5 w-5 text-red-600 dark:text-red-400" />
    default:
      return <XCircleIconSolid className="h-5 w-5 text-gray-400" />
  }
}

export default function AuditResultsPage({ params: _params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const auditId = params?.id as string

  useEffect(() => {
    async function fetchAuditResults() {
      try {
        setLoading(true)
        const response = await fetch(`/api/audit/${auditId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch audit results')
        }

        const result = await response.json()
        setAuditData(result.audit)
      } catch (err) {
        console.error('Error fetching audit results:', err)
        setError(err instanceof Error ? err.message : 'Failed to load audit results')
        // Fall back to mock data if API fails
        setAuditData(mockAuditResults)
      } finally {
        setLoading(false)
      }
    }

    if (auditId) {
      fetchAuditResults()
    }
  }, [auditId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading audit results...</p>
        </div>
      </div>
    )
  }

  if (error && !auditData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    )
  }

  // Use real data if available, otherwise fall back to mock data
  const data = auditData || mockAuditResults
  const { categories, overallScore, url, totalFactors, totalIssues, priorityIssues } = data

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
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getScoreColor(overallScore)} ${getScoreBgColor(overallScore)}`}>
              <TrophyIcon className={`h-8 w-8 ${getScoreColor(overallScore)}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">SEO Audit Results</h1>
              <p className="text-lg text-muted-foreground">{url}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3" />
              <span>January 15, 2024</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <ChartBarIcon className="h-3 w-3" />
              <span>{totalFactors} factors analyzed</span>
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button className="btn-premium">
            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-center lg:text-left space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Overall SEO Score
                  </h2>
                  <p className="text-muted-foreground">
                    Comprehensive analysis across {totalFactors} factors
                  </p>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIconSolid className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{priorityIssues} priority issues</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <InformationCircleIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{totalIssues - priorityIssues} opportunities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIconSolid className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">{totalFactors - totalIssues} factors optimal</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {Object.entries(categories).map(([key, category]: [string, any]) => {
                  const config = categoryConfig[key as keyof typeof categoryConfig]
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${config.bgColor} border ${config.borderColor} text-center cursor-pointer`}
                      onClick={() => setActiveTab(key)}
                    >
                      <div className={`bg-gradient-to-r ${config.color} p-2 rounded-lg mx-auto w-fit mb-2`}>
                        <config.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}
                      </div>
                      <div className="text-xs text-muted-foreground">{config.name}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="local">Local</TabsTrigger>
            <TabsTrigger value="ux">UX</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Insights */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                </div>
                <CardDescription>Strategic recommendations based on your audit results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Priority Recommendations
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-start space-x-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Optimize meta titles and descriptions to improve click-through rates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Improve local SEO citations and NAP consistency for better local rankings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Enhance mobile usability to reduce bounce rate and improve user experience</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Top Issues */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Priority Issues</CardTitle>
                <CardDescription>Issues that require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleFactors.filter(factor => factor.status === 'Priority OFI').map((factor, index) => (
                    <motion.div
                      key={factor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                          {getStatusIcon(factor.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-red-900 dark:text-red-100">
                              {factor.name}
                            </h3>
                            <Badge variant="destructive">
                              Score: {factor.score}
                            </Badge>
                          </div>
                          <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                            {factor.description}
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                            💡 {factor.recommendation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {Object.entries(categoryConfig).map(([categoryKey, config]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${config.color} p-3 rounded-xl`}>
                        <config.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{config.name} Analysis</CardTitle>
                        <CardDescription>
                          {categories[categoryKey as keyof typeof categories].factors} factors analyzed
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(categories[categoryKey as keyof typeof categories].score)}`}>
                        {categories[categoryKey as keyof typeof categories].score}
                      </div>
                      <div className="text-sm text-muted-foreground">Category Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleFactors
                      .filter(factor => factor.category === categoryKey)
                      .map((factor, index) => (
                        <motion.div
                          key={factor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-xl border ${
                            factor.status === 'OK' 
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/50'
                              : factor.status === 'Priority OFI'
                                ? 'bg-red-50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/50'
                                : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/50'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg ${
                              factor.status === 'OK'
                                ? 'bg-emerald-100 dark:bg-emerald-900/50'
                                : factor.status === 'Priority OFI'
                                  ? 'bg-red-100 dark:bg-red-900/50'
                                  : 'bg-blue-100 dark:bg-blue-900/50'
                            }`}>
                              {getStatusIcon(factor.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className={`font-semibold ${
                                  factor.status === 'OK'
                                    ? 'text-emerald-900 dark:text-emerald-100'
                                    : factor.status === 'Priority OFI'
                                      ? 'text-red-900 dark:text-red-100'
                                      : 'text-blue-900 dark:text-blue-100'
                                }`}>
                                  {factor.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {factor.importance} Priority
                                  </Badge>
                                  <Badge className={
                                    factor.status === 'OK'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                                      : factor.status === 'Priority OFI'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                  }>
                                    Score: {factor.score}
                                  </Badge>
                                </div>
                              </div>
                              <p className={`text-sm mb-2 ${
                                factor.status === 'OK'
                                  ? 'text-emerald-800 dark:text-emerald-200'
                                  : factor.status === 'Priority OFI'
                                    ? 'text-red-800 dark:text-red-200'
                                    : 'text-blue-800 dark:text-blue-200'
                              }`}>
                                {factor.description}
                              </p>
                              <p className={`text-sm font-medium ${
                                factor.status === 'OK'
                                  ? 'text-emerald-700 dark:text-emerald-300'
                                  : factor.status === 'Priority OFI'
                                    ? 'text-red-700 dark:text-red-300'
                                    : 'text-blue-700 dark:text-blue-300'
                              }`}>
                                💡 {factor.recommendation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  )
}