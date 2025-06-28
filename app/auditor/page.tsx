"use client"

import { useState } from 'react'
import { useWebSocketContext } from '@/components/providers/websocket-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DocumentMagnifyingGlassIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CpuChipIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid'

interface AnalysisStep {
  id: string
  name: string
  description: string
  category: 'content' | 'technical' | 'local' | 'ux'
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  factors: number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'content',
    name: 'Content Quality Analysis',
    description: 'Analyzing content depth, E-E-A-T signals, and user engagement',
    category: 'content',
    status: 'pending',
    progress: 0,
    factors: 35,
    icon: DocumentMagnifyingGlassIcon
  },
  {
    id: 'technical',
    name: 'Technical SEO Analysis',
    description: 'Core Web Vitals, technical foundation, and accessibility',
    category: 'technical',
    status: 'pending',
    progress: 0,
    factors: 40,
    icon: CpuChipIcon
  },
  {
    id: 'local',
    name: 'Local SEO Analysis',
    description: 'NAP consistency, Google My Business, and local citations',
    category: 'local',
    status: 'pending',
    progress: 0,
    factors: 35,
    icon: MapPinIcon
  },
  {
    id: 'ux',
    name: 'UX Performance Analysis',
    description: 'User experience, performance metrics, and mobile optimization',
    category: 'ux',
    status: 'pending',
    progress: 0,
    factors: 30,
    icon: UserGroupIcon
  }
]

const categoryColors = {
  content: 'from-blue-500 to-indigo-600',
  technical: 'from-emerald-500 to-teal-600',
  local: 'from-amber-500 to-orange-600',
  ux: 'from-purple-500 to-pink-600'
}

export default function AuditorPage() {
  const router = useRouter()
  const { isConnected, subscribeToAuditProgress, subscribeToAuditComplete, subscribeToAuditError } = useWebSocketContext()
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(analysisSteps)
  const [analysisType, setAnalysisType] = useState<'standard' | 'comprehensive'>('comprehensive')
  const [includeAI] = useState(true)
  const [, setCurrentAuditId] = useState<string | null>(null)

  const handleStartAnalysis = async () => {
    if (!url.trim()) return

    setIsAnalyzing(true)
    setCurrentStep(0)
    setSteps(analysisSteps.map(step => ({ ...step, status: 'pending', progress: 0 })))

    let auditId: string | null = null

    // If WebSocket is connected, use real-time updates
    if (isConnected) {
      // Start the audit via API call (this would trigger the backend to start processing)
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Add auth header
          },
          body: JSON.stringify({
            url,
            type: analysisType,
            title: `SEO Audit - ${url}`,
            config: {
              maxPages: analysisType === 'comprehensive' ? 25 : 10,
              includeSubdomains: false,
              analyzeCompetitors: false
            }
          })
        })

        if (!response.ok) {
          throw new Error('Failed to start audit')
        }

        const result = await response.json()
        auditId = result.auditId?.toString()
        setCurrentAuditId(auditId)

        if (auditId) {
          // Subscribe to real-time progress updates after getting the audit ID
          const unsubscribeProgress = subscribeToAuditProgress(auditId, (progress) => {
            setCurrentStep(progress.currentStep || 0)
            setSteps(prev => prev.map((step, index) => {
              if (index === progress.currentStep) {
                return { ...step, status: 'running', progress: progress.stepProgress || 0 }
              } else if (index < (progress.currentStep || 0)) {
                return { ...step, status: 'completed', progress: 100 }
              }
              return step
            }))
          })

          // Subscribe to completion
          const unsubscribeComplete = subscribeToAuditComplete(auditId, (_result) => {
            setSteps(prev => prev.map(step => ({ ...step, status: 'completed', progress: 100 })))
            setTimeout(() => {
              router.push(`/results/${auditId}`)
            }, 1000)
          })

          // Subscribe to errors
          const unsubscribeError = subscribeToAuditError(auditId, (_error) => {
            setSteps(prev => prev.map((step, index) => 
              index === currentStep 
                ? { ...step, status: 'error', progress: 0 }
                : step
            ))
            setIsAnalyzing(false)
          })

          // Cleanup subscriptions when component unmounts or analysis completes
          return () => {
            unsubscribeProgress()
            unsubscribeComplete()
            unsubscribeError()
          }
        }
      } catch (error) {
        console.error('Failed to start audit:', error)
        setIsAnalyzing(false)
      }
    } else {
      // Fallback to simulated progress if WebSocket is not connected
      auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setCurrentAuditId(auditId)
      
      for (let i = 0; i < steps.length; i++) {
        setSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'running' } 
            : index < i 
              ? { ...step, status: 'completed', progress: 100 }
              : step
        ))
        setCurrentStep(i)

        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          setSteps(prev => prev.map((step, index) => 
            index === i ? { ...step, progress } : step
          ))
        }

        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed', progress: 100 } : step
        ))
      }

      setTimeout(() => {
        router.push(`/results/${auditId}`)
      }, 1000)
    }
  }

  const totalFactors = steps.reduce((sum, step) => sum + step.factors, 0)
  const overallProgress = steps.reduce((sum, step) => sum + step.progress, 0) / steps.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
            <DocumentMagnifyingGlassIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">SEO Auditor</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive {totalFactors}+ factor analysis with AI-powered insights
            </p>
          </div>
        </div>
      </motion.div>

      {!isAnalyzing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* URL Input */}
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Start Your SEO Analysis
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your website URL to begin a comprehensive SEO audit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12 text-lg px-4 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <Button
                  onClick={handleStartAnalysis}
                  disabled={!url.trim()}
                  size="lg"
                  className="btn-premium h-12 px-8"
                >
                  <RocketLaunchIcon className="mr-2 h-5 w-5" />
                  Start Analysis
                </Button>
              </div>

              {/* Analysis Options */}
              <Tabs value={analysisType} onValueChange={(value: string) => setAnalysisType(value as 'standard' | 'comprehensive')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard (50+ factors)</TabsTrigger>
                  <TabsTrigger value="comprehensive">Comprehensive (140+ factors)</TabsTrigger>
                </TabsList>
                <TabsContent value="standard" className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Standard Analysis</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Quick overview covering essential SEO factors. Perfect for regular monitoring and basic optimization.
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        ~5 minutes
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                        50+ factors
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="comprehensive" className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/50">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Comprehensive Analysis</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Complete deep-dive analysis covering all aspects of SEO. Industry-leading depth for professional audits.
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                        ~15 minutes
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                        140+ factors
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                        AI insights
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Analysis Categories Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-interactive h-full">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`bg-gradient-to-r ${categoryColors[step.category]} p-4 rounded-xl mx-auto w-fit`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {step.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50">
                        {step.factors} factors
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Analysis Progress Header */}
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl mx-auto w-fit"
                >
                  <DocumentMagnifyingGlassIcon className="h-12 w-12 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Analyzing {url}
                  </h2>
                  <p className="text-muted-foreground">
                    Running comprehensive {totalFactors}+ factor analysis...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 ${
                  step.status === 'running' 
                    ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20' 
                    : step.status === 'completed'
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                      : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        step.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/50'
                          : step.status === 'running'
                            ? `bg-gradient-to-r ${categoryColors[step.category]}`
                            : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircleIconSolid className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : step.status === 'running' ? (
                          <ArrowPathIcon className="h-6 w-6 text-white animate-spin" />
                        ) : (
                          <step.icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {step.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {step.factors} factors
                            </Badge>
                            {step.status === 'completed' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                Complete
                              </Badge>
                            )}
                            {step.status === 'running' && (
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                                Analyzing...
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        {(step.status === 'running' || step.status === 'completed') && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{step.progress}%</span>
                            </div>
                            <Progress value={step.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Real-time Insights */}
          <AnimatePresence>
            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-card border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        Real-time Insights
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <motion.p
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {currentStep === 0 && "Analyzing content quality and E-E-A-T signals..."}
                        {currentStep === 1 && "Checking Core Web Vitals and technical foundation..."}
                        {currentStep === 2 && "Evaluating local SEO factors and NAP consistency..."}
                        {currentStep === 3 && "Assessing user experience and mobile optimization..."}
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}