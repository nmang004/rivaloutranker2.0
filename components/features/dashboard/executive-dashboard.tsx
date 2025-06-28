'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KPIMetrics {
  overview: {
    totalAudits: number;
    completedAudits: number;
    inProgressAudits: number;
    averageScore: number;
    scoreTrend: number;
    scoreDistribution: { excellent: number; good: number; average: number; poor: number };
  };
  categoryPerformance: {
    contentQuality: { score: number; trend: number; issues: number; topOpportunities: string[] };
    technicalSEO: { score: number; trend: number; issues: number; topOpportunities: string[] };
    localSEO: { score: number; trend: number; issues: number; topOpportunities: string[] };
    uxPerformance: { score: number; trend: number; issues: number; topOpportunities: string[] };
  };
  performanceMetrics: {
    weeklyProgress: Array<{
      week: string;
      score: number;
      audits: number;
    }>;
    averageScoreByCategory: Array<{
      category: string;
      score: number;
    }>;
    averageAuditTime: number;
    factorsAnalyzed: number;
    aiInsightsGenerated: number;
    auditCompletionRate: number;
  };
  issueMetrics: {
    criticalIssues: number;
    highPriorityIssues: number;
    mediumPriorityIssues: number;
    lowPriorityIssues: number;
    resolvedIssues: number;
    openIssues: number;
    mostCommonIssues: Array<{
      type: string;
      count: number;
    }>;
  };
}

interface ROIAnalysis {
  overview: {
    estimatedROI: number;
    roiTrend: number;
    totalInvestment: number;
    projectedReturns: number;
    paybackPeriod: number;
    netBenefit: number;
  };
  trafficProjections: {
    currentMonthlyTraffic: number;
    projectedMonthlyTraffic: number;
    growthRate: number;
    estimatedConversionImpact: number;
  };
  impactMetrics: {
    organicTrafficIncrease: {
      estimated: string;
      timeframe: string;
      confidence: string;
    };
    rankingImprovements: {
      expectedKeywords: number;
      averagePositionGain: number;
      competitiveAdvantage: string;
    };
    conversionOptimization: {
      estimatedUXImprovements: string;
      technicalPerformanceGains: string;
      mobileExperienceEnhancement: string;
    };
  };
  opportunities: {
    technicalOptimization: {
      potentialTrafficGain: string;
      estimatedValue: number;
      implementationCost: number;
      timeToImplement: string;
    };
    contentOptimization: {
      potentialTrafficGain: string;
      estimatedValue: number;
      implementationCost: number;
      timeToImplement: string;
    };
    linkBuilding: {
      potentialTrafficGain: string;
      estimatedValue: number;
      implementationCost: number;
      timeToImplement: string;
    };
    localSEO: {
      potentialTrafficGain: string;
      estimatedValue: number;
      implementationCost: number;
      timeToImplement: string;
    };
    conversionOptimization: {
      estimatedUXImprovements: string;
      technicalPerformanceGains: string;
      mobileExperienceEnhancement: string;
    };
  };
  costBenefit: {
    implementationCosts: number;
    maintenanceCosts: number;
    opportunityCosts: number;
    totalCostAvoidance: number;
  };
  businessImpact: {
    revenueProjections: number;
    marketShareGains: string;
    brandAuthority: string;
    longTermValue: number;
  };
}

interface CompetitiveIntelligence {
  marketPosition: {
    averageIndustryScore: number;
    yourAverageScore: number;
    competitiveRanking: number;
    marketLeaders: string[];
    opportunityGaps: string[];
  };
  competitorAnalysis: {
    directCompetitors: Array<{
      name: string;
      averageScore: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    competitorStrengths: string[];
    competitorWeaknesses: string[];
    competitiveThreats: string[];
    marketOpportunities: string[];
  };
  strategicInsights: {
    differentiationOpportunities: string[];
    quickWinAreas: string[];
    longTermAdvantages: string[];
    threatMitigation: string[];
  };
}

interface ActionPlan {
  actions: Array<{
    title: string;
    description: string;
  }>;
  estimatedImpact: string;
  timeframe: string;
  resources: string;
  expectedROI: string;
}

interface ActionPlanPrioritization {
  immediate: ActionPlan;
  shortTerm: ActionPlan;
  mediumTerm: ActionPlan;
  longTerm: ActionPlan;
  budgetAllocation: {
    immediate: number;
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
}

interface ExecutiveSummary {
  keyHighlights: string[];
  criticalFindings: string[];
}

interface DashboardData {
  kpiMetrics: KPIMetrics;
  roiAnalysis: ROIAnalysis;
  competitiveIntelligence: CompetitiveIntelligence;
  actionPlanPrioritization: ActionPlanPrioritization;
  executiveSummary: ExecutiveSummary;
}

/**
 * Executive Dashboard Component - Phase 3.3
 * High-level KPI tracking, ROI reporting, competitive intelligence,
 * and action plan prioritization for executive decision making
 */
export function ExecutiveDashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockData = generateMockDashboardData();
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return <div className="p-6">Failed to load dashboard data</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            High-level insights and strategic recommendations for SEO performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as 'week' | 'month' | 'quarter' | 'year')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Audits"
          value={dashboardData.kpiMetrics.overview.totalAudits}
          trend={dashboardData.kpiMetrics.overview.scoreTrend}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Completed SEO audits"
        />
        <MetricCard
          title="Average Score"
          value={`${dashboardData.kpiMetrics.overview.averageScore}/100`}
          trend={dashboardData.kpiMetrics.overview.scoreTrend}
          icon={<Target className="h-5 w-5" />}
          description="Overall SEO performance"
        />
        <MetricCard
          title="Critical Issues"
          value={dashboardData.kpiMetrics.issueMetrics.criticalIssues}
          trend={-2.1}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Require immediate attention"
          variant="warning"
        />
        <MetricCard
          title="Estimated ROI"
          value={`${dashboardData.roiAnalysis.overview.estimatedROI}%`}
          trend={12.5}
          icon={<DollarSign className="h-5 w-5" />}
          description="Expected return on investment"
          variant="success"
        />
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            Key highlights and strategic insights for the {timeframe}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Key Highlights</h4>
              <ul className="space-y-2">
                {dashboardData.executiveSummary.keyHighlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Critical Findings</h4>
              <ul className="space-y-2">
                {dashboardData.executiveSummary.criticalFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="actions">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab data={dashboardData} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceTab data={dashboardData} />
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <ROIAnalysisTab data={dashboardData} />
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <CompetitiveTab data={dashboardData} />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <ActionPlanTab data={dashboardData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

function MetricCard({ title, value, trend, icon, description, variant = 'default' }: MetricCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

  const variantStyles = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-red-200 bg-red-50'
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span className="text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Overview Tab Component
function OverviewTab({ data }: { data: DashboardData }) {
  const categoryData = [
    { name: 'Content Quality', score: data.kpiMetrics.categoryPerformance.contentQuality.score, color: '#3B82F6' },
    { name: 'Technical SEO', score: data.kpiMetrics.categoryPerformance.technicalSEO.score, color: '#10B981' },
    { name: 'Local SEO', score: data.kpiMetrics.categoryPerformance.localSEO.score, color: '#F59E0B' },
    { name: 'UX Performance', score: data.kpiMetrics.categoryPerformance.uxPerformance.score, color: '#8B5CF6' }
  ];

  const scoreDistribution = [
    { name: 'Excellent (90+)', value: data.kpiMetrics.overview.scoreDistribution.excellent, color: '#10B981' },
    { name: 'Good (70-89)', value: data.kpiMetrics.overview.scoreDistribution.good, color: '#3B82F6' },
    { name: 'Average (50-69)', value: data.kpiMetrics.overview.scoreDistribution.average, color: '#F59E0B' },
    { name: 'Poor (<50)', value: data.kpiMetrics.overview.scoreDistribution.poor, color: '#EF4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>SEO scores by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Distribution of audit scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scoreDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Issues</CardTitle>
          <CardDescription>Top issues found across audits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.kpiMetrics.issueMetrics.mostCommonIssues.map((issue: { type: string; count: number }, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{issue.type}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{issue.count}</Badge>
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(issue.count / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Audit execution performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Audit Time</span>
              <span className="font-medium">{data.kpiMetrics.performanceMetrics.averageAuditTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Factors Analyzed</span>
              <span className="font-medium">{data.kpiMetrics.performanceMetrics.factorsAnalyzed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Insights Generated</span>
              <span className="font-medium">{data.kpiMetrics.performanceMetrics.aiInsightsGenerated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completion Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{data.kpiMetrics.performanceMetrics.auditCompletionRate}%</span>
                <Progress value={data.kpiMetrics.performanceMetrics.auditCompletionRate} className="w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Performance Tab Component
function PerformanceTab({ data }: { data: DashboardData }) {
  const performanceData = [
    { month: 'Jan', score: 68, issues: 45, resolved: 32 },
    { month: 'Feb', score: 72, issues: 38, resolved: 41 },
    { month: 'Mar', score: 75, issues: 42, resolved: 38 },
    { month: 'Apr', score: 78, issues: 35, resolved: 45 },
    { month: 'May', score: 81, issues: 28, resolved: 42 },
    { month: 'Jun', score: 84, issues: 25, resolved: 38 }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>SEO performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} name="Average Score" />
              <Line yAxisId="right" type="monotone" dataKey="issues" stroke="#EF4444" strokeWidth={2} name="Issues Found" />
              <Line yAxisId="right" type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Issues Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(data.kpiMetrics.categoryPerformance).map(([category, performance]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
              <CardDescription>Detailed performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{performance.score}/100</span>
                    <Badge variant={performance.score > 80 ? 'default' : performance.score > 60 ? 'secondary' : 'destructive'}>
                      {performance.score > 80 ? 'Excellent' : performance.score > 60 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
                <Progress value={performance.score} className="h-2" />
                <div className="flex items-center gap-2">
                  {performance.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${performance.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(performance.trend)}% {performance.trend > 0 ? 'improvement' : 'decline'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Top Opportunities:</p>
                  <ul className="text-xs space-y-1">
                    {performance.topOpportunities.map((opportunity: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ROI Analysis Tab Component
function ROIAnalysisTab({ data }: { data: DashboardData }) {
  const roiData = data.roiAnalysis;

  return (
    <div className="space-y-6">
      {/* ROI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <p className="text-2xl font-bold">${roiData.overview.totalInvestment.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Estimated ROI</p>
              <p className="text-2xl font-bold text-green-600">{roiData.overview.estimatedROI}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-2xl font-bold">{roiData.overview.paybackPeriod} months</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Net Benefit</p>
              <p className="text-2xl font-bold text-green-600">${roiData.overview.netBenefit.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Projected Impact Metrics</CardTitle>
          <CardDescription>Expected improvements from SEO optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Organic Traffic</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Estimated Increase</span>
                  <span className="font-medium">{roiData.impactMetrics.organicTrafficIncrease.estimated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Timeframe</span>
                  <span className="font-medium">{roiData.impactMetrics.organicTrafficIncrease.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confidence Level</span>
                  <Badge variant="outline">{roiData.impactMetrics.organicTrafficIncrease.confidence}</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Ranking Improvements</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Expected Keywords</span>
                  <span className="font-medium">{roiData.impactMetrics.rankingImprovements.expectedKeywords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Position Gain</span>
                  <span className="font-medium">+{roiData.impactMetrics.rankingImprovements.averagePositionGain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Competitive Edge</span>
                  <Badge variant="outline">{roiData.impactMetrics.rankingImprovements.competitiveAdvantage}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Conversion Optimization</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="mb-1">UX Improvements:</p>
                  <p className="text-muted-foreground">{roiData.impactMetrics.conversionOptimization.estimatedUXImprovements}</p>
                </div>
                <div className="text-sm">
                  <p className="mb-1">Technical Performance:</p>
                  <p className="text-muted-foreground">{roiData.impactMetrics.conversionOptimization.technicalPerformanceGains}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost-Benefit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost-Benefit Analysis</CardTitle>
          <CardDescription>Detailed breakdown of costs and benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Investment Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Implementation Costs</span>
                  <span className="font-medium">${roiData.costBenefit.implementationCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Costs</span>
                  <span className="font-medium">${roiData.costBenefit.maintenanceCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Opportunity Costs</span>
                  <span className="font-medium">${roiData.costBenefit.opportunityCosts.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Total Cost Avoidance</span>
                  <span>${roiData.costBenefit.totalCostAvoidance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Business Impact</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue Projections</span>
                  <span className="font-medium text-green-600">${roiData.businessImpact.revenueProjections.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Market Share Gains</span>
                  <span className="font-medium">{roiData.businessImpact.marketShareGains}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Brand Authority</span>
                  <span className="font-medium">{roiData.businessImpact.brandAuthority}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Long-term Value</span>
                  <span className="text-green-600">${roiData.businessImpact.longTermValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Competitive Tab Component
function CompetitiveTab({ data }: { data: DashboardData }) {
  const competitive = data.competitiveIntelligence;

  return (
    <div className="space-y-6">
      {/* Market Position */}
      <Card>
        <CardHeader>
          <CardTitle>Market Position</CardTitle>
          <CardDescription>Your competitive standing in the market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Industry Average</p>
              <p className="text-3xl font-bold">{competitive.marketPosition.averageIndustryScore}/100</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Your Average</p>
              <p className="text-3xl font-bold text-blue-600">{competitive.marketPosition.yourAverageScore}/100</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Market Ranking</p>
              <p className="text-3xl font-bold">#{competitive.marketPosition.competitiveRanking}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Strengths</CardTitle>
            <CardDescription>What competitors are doing well</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {competitive.competitorAnalysis.competitorStrengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitor Weaknesses</CardTitle>
            <CardDescription>Opportunities to capitalize on</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {competitive.competitorAnalysis.competitorWeaknesses.map((weakness: string, index: number) => (
                <li key={index} className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Insights</CardTitle>
          <CardDescription>Actionable competitive intelligence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Differentiation Opportunities</h4>
              <ul className="space-y-2">
                {competitive.strategicInsights.differentiationOpportunities.map((opportunity: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-sm">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Win Areas</h4>
              <ul className="space-y-2">
                {competitive.strategicInsights.quickWinAreas.map((area: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Action Plan Tab Component
function ActionPlanTab({ data }: { data: DashboardData }) {
  const actionPlan = data.actionPlanPrioritization;

  return (
    <div className="space-y-6">
      {/* Action Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Action Plan Prioritization</CardTitle>
          <CardDescription>Strategic roadmap for SEO improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800">Immediate</h4>
              <p className="text-2xl font-bold text-red-600">{actionPlan.immediate.actions.length}</p>
              <p className="text-xs text-red-600">{actionPlan.immediate.timeframe}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800">Short-term</h4>
              <p className="text-2xl font-bold text-orange-600">{actionPlan.shortTerm.actions.length}</p>
              <p className="text-xs text-orange-600">{actionPlan.shortTerm.timeframe}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800">Medium-term</h4>
              <p className="text-2xl font-bold text-blue-600">{actionPlan.mediumTerm.actions.length}</p>
              <p className="text-xs text-blue-600">{actionPlan.mediumTerm.timeframe}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800">Long-term</h4>
              <p className="text-2xl font-bold text-green-600">{actionPlan.longTerm.actions.length}</p>
              <p className="text-xs text-green-600">{actionPlan.longTerm.timeframe}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immediate Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Immediate Actions
          </CardTitle>
          <CardDescription>
            Critical actions requiring immediate attention ({actionPlan.immediate.timeframe})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actionPlan.immediate.actions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{action.title || `Critical Action ${index + 1}`}</h4>
                  <p className="text-sm text-muted-foreground">{action.description || 'High-priority optimization'}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">High Impact</Badge>
                    <Badge variant="outline">Easy</Badge>
                  </div>
                </div>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Expected ROI:</span>
              <span className="font-semibold text-green-600">{actionPlan.immediate.expectedROI}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Resources Required:</span>
              <span className="font-medium">{actionPlan.immediate.resources}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>Recommended resource distribution across timeframes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(actionPlan.budgetAllocation).map(([timeframe, percentage]) => (
              <div key={timeframe} className="space-y-2">
                <div className="flex justify-between">
                  <span className="capitalize font-medium">{timeframe}</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

// Mock data generator
function generateMockDashboardData() {
  return {
    kpiMetrics: {
      overview: {
        totalAudits: 45,
        completedAudits: 38,
        inProgressAudits: 7,
        averageScore: 76,
        scoreTrend: 5.2,
        scoreDistribution: { excellent: 8, good: 22, average: 12, poor: 3 }
      },
      categoryPerformance: {
        contentQuality: { score: 72, trend: 3.1, issues: 15, topOpportunities: ['Improve content depth', 'Add semantic keywords', 'Optimize readability'] },
        technicalSEO: { score: 84, trend: 7.8, issues: 8, topOpportunities: ['Fix crawl errors', 'Improve site speed', 'Optimize structured data'] },
        localSEO: { score: 68, trend: 2.4, issues: 22, topOpportunities: ['Complete GMB profile', 'Build local citations', 'Add location pages'] },
        uxPerformance: { score: 79, trend: 4.6, issues: 12, topOpportunities: ['Improve mobile experience', 'Optimize page speed', 'Enhance navigation'] }
      },
      issueMetrics: {
        criticalIssues: 12,
        highPriorityIssues: 18,
        mediumPriorityIssues: 22,
        lowPriorityIssues: 15,
        resolvedIssues: 38,
        openIssues: 29,
        mostCommonIssues: [
          { type: 'Missing meta descriptions', count: 28 },
          { type: 'Thin content pages', count: 22 },
          { type: 'Slow page loading', count: 18 },
          { type: 'Missing alt text', count: 15 },
          { type: 'Broken internal links', count: 12 }
        ]
      },
      performanceMetrics: {
        weeklyProgress: [
          { week: 'Week 1', score: 72, audits: 8 },
          { week: 'Week 2', score: 75, audits: 12 },
          { week: 'Week 3', score: 78, audits: 15 },
          { week: 'Week 4', score: 76, audits: 10 }
        ],
        averageScoreByCategory: [
          { category: 'Technical SEO', score: 84 },
          { category: 'Content Quality', score: 72 },
          { category: 'UX Performance', score: 79 },
          { category: 'Local SEO', score: 68 }
        ],
        averageAuditTime: 165,
        factorsAnalyzed: 6750,
        aiInsightsGenerated: 42,
        auditCompletionRate: 98
      }
    },
    roiAnalysis: {
      overview: {
        estimatedROI: 285,
        roiTrend: 12.5,
        totalInvestment: 6750,
        projectedReturns: 19230,
        paybackPeriod: 4,
        netBenefit: 19230
      },
      trafficProjections: {
        currentMonthlyTraffic: 12500,
        projectedMonthlyTraffic: 18750,
        growthRate: 50,
        estimatedConversionImpact: 35
      },
      impactMetrics: {
        organicTrafficIncrease: {
          estimated: '35-50%',
          timeframe: '6 months',
          confidence: 'High'
        },
        rankingImprovements: {
          expectedKeywords: 180,
          averagePositionGain: 8,
          competitiveAdvantage: 'Strong'
        },
        conversionOptimization: {
          estimatedUXImprovements: '25-35% improvement in user experience metrics',
          technicalPerformanceGains: '40-60% improvement in technical performance',
          mobileExperienceEnhancement: '30-45% improvement in mobile scores'
        }
      },
      opportunities: {
        technicalOptimization: {
          potentialTrafficGain: '15-25%',
          estimatedValue: 8500,
          implementationCost: 2000,
          timeToImplement: '2-3 months'
        },
        contentOptimization: {
          potentialTrafficGain: '20-30%',
          estimatedValue: 12000,
          implementationCost: 3500,
          timeToImplement: '3-4 months'
        },
        linkBuilding: {
          potentialTrafficGain: '10-20%',
          estimatedValue: 6500,
          implementationCost: 4000,
          timeToImplement: '4-6 months'
        },
        localSEO: {
          potentialTrafficGain: '25-40%',
          estimatedValue: 15000,
          implementationCost: 2500,
          timeToImplement: '2-3 months'
        },
        conversionOptimization: {
          estimatedUXImprovements: '25-35% improvement in user experience metrics',
          technicalPerformanceGains: '40-60% improvement in technical performance',
          mobileExperienceEnhancement: '30-45% improvement in mobile scores'
        }
      },
      costBenefit: {
        implementationCosts: 12000,
        maintenanceCosts: 3600,
        opportunityCosts: 8400,
        totalCostAvoidance: 24000
      },
      businessImpact: {
        revenueProjections: 85000,
        marketShareGains: '3-7%',
        brandAuthority: 'Significant improvement',
        longTermValue: 250000
      }
    },
    competitiveIntelligence: {
      marketPosition: {
        averageIndustryScore: 72,
        yourAverageScore: 76,
        competitiveRanking: 3,
        marketLeaders: ['Competitor A', 'Competitor B'],
        opportunityGaps: ['Content depth', 'Technical optimization', 'Local presence']
      },
      competitorAnalysis: {
        directCompetitors: [],
        competitorStrengths: ['Strong content strategy', 'Advanced technical implementation', 'Comprehensive local presence'],
        competitorWeaknesses: ['Poor mobile experience', 'Weak local SEO', 'Limited content depth'],
        competitiveThreats: ['Aggressive content marketing', 'Technical SEO improvements'],
        marketOpportunities: ['Underserved keywords', 'Mobile-first content gaps']
      },
      strategicInsights: {
        differentiationOpportunities: ['AI-powered content optimization', 'Advanced local SEO', 'Technical excellence'],
        quickWinAreas: ['Meta tag optimization', 'Image optimization', 'Internal linking'],
        longTermAdvantages: ['Comprehensive content strategy', 'Technical SEO excellence'],
        threatMitigation: ['Monitor competitor content', 'Strengthen technical foundation']
      }
    },
    actionPlanPrioritization: {
      immediate: {
        actions: [
          { title: 'Fix Critical Technical Issues', description: 'Address crawl errors and indexing issues' },
          { title: 'Optimize High-Traffic Pages', description: 'Update meta tags and content on key pages' },
          { title: 'Resolve Mobile Usability Issues', description: 'Fix mobile experience problems' }
        ],
        estimatedImpact: 'High',
        timeframe: '1-2 weeks',
        resources: 'Development team + SEO specialist',
        expectedROI: '200-400%'
      },
      shortTerm: {
        actions: Array.from({ length: 8 }, (_, i) => ({ title: `Short-term action ${i + 1}`, description: 'Action description' })),
        estimatedImpact: 'Medium-High',
        timeframe: '1-2 months',
        resources: 'Content team + Technical team',
        expectedROI: '150-300%'
      },
      mediumTerm: {
        actions: Array.from({ length: 10 }, (_, i) => ({ title: `Medium-term action ${i + 1}`, description: 'Action description' })),
        estimatedImpact: 'Medium',
        timeframe: '3-6 months',
        resources: 'Full marketing team',
        expectedROI: '100-200%'
      },
      longTerm: {
        actions: Array.from({ length: 5 }, (_, i) => ({ title: `Long-term action ${i + 1}`, description: 'Action description' })),
        estimatedImpact: 'High (Sustained)',
        timeframe: '6-12 months',
        resources: 'Cross-functional teams',
        expectedROI: '300-500%'
      },
      budgetAllocation: {
        immediate: 30,
        shortTerm: 40,
        mediumTerm: 20,
        longTerm: 10
      }
    },
    executiveSummary: {
      keyHighlights: [
        'Analyzed 45 websites with an average SEO score of 76/100',
        'Identified 12 critical issues requiring immediate attention',
        'Discovered 57 optimization opportunities across all properties',
        'Estimated ROI of 285% from implementing recommendations'
      ],
      criticalFindings: [
        '12 critical issues require immediate attention',
        'Technical SEO improvements needed across multiple sites',
        'Content quality optimization opportunities identified',
        'Mobile experience enhancements recommended'
      ]
    }
  };
}