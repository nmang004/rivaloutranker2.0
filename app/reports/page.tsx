"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { 
  DocumentTextIcon as DocumentTextIconSolid,
  ChartBarIcon as ChartBarIconSolid
} from '@heroicons/react/24/solid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Report {
  id: string
  name: string
  type: 'audit' | 'monthly' | 'custom' | 'executive'
  project: string
  url: string
  createdAt: string
  status: 'completed' | 'generating' | 'scheduled'
  format: 'pdf' | 'excel' | 'html'
  size: string
  downloads: number
  shared: boolean
  scheduledFor?: string
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'E-commerce SEO Audit Report',
    type: 'audit',
    project: 'E-commerce Website',
    url: 'https://example-store.com',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'completed',
    format: 'pdf',
    size: '2.4 MB',
    downloads: 12,
    shared: true
  },
  {
    id: '2',
    name: 'Monthly Performance Summary',
    type: 'monthly',
    project: 'Corporate Blog',
    url: 'https://company-blog.com',
    createdAt: '2024-01-14T09:15:00Z',
    status: 'completed',
    format: 'excel',
    size: '1.8 MB',
    downloads: 8,
    shared: false
  },
  {
    id: '3',
    name: 'Executive Dashboard Report',
    type: 'executive',
    project: 'All Projects',
    url: 'Multiple URLs',
    createdAt: '2024-01-13T16:45:00Z',
    status: 'completed',
    format: 'html',
    size: '3.2 MB',
    downloads: 25,
    shared: true
  },
  {
    id: '4',
    name: 'Local Business SEO Analysis',
    type: 'audit',
    project: 'Local Service Business',
    url: 'https://local-services.com',
    createdAt: '2024-01-12T14:20:00Z',
    status: 'generating',
    format: 'pdf',
    size: '—',
    downloads: 0,
    shared: false,
    scheduledFor: '2024-01-16T10:00:00Z'
  }
]

const reportTypeConfig = {
  audit: {
    name: 'SEO Audit',
    icon: ChartBarIcon,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  monthly: {
    name: 'Monthly Report',
    icon: CalendarIcon,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-700 dark:text-emerald-300'
  },
  custom: {
    name: 'Custom Report',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-700 dark:text-purple-300'
  },
  executive: {
    name: 'Executive Summary',
    icon: UserGroupIcon,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-700 dark:text-amber-300'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">Completed</Badge>
    case 'generating':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">Generating</Badge>
    case 'scheduled':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">Scheduled</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getFormatBadge = (format: string) => {
  const colors = {
    pdf: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    excel: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    html: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  }
  return <Badge className={colors[format as keyof typeof colors] || 'bg-slate-100 text-slate-800'}>{format.toUpperCase()}</Badge>
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const reportTypes = ['all', ...Array.from(new Set(mockReports.map(r => r.type)))]
  const reportStatuses = ['all', ...Array.from(new Set(mockReports.map(r => r.status)))]

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
              <DocumentTextIconSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">Reports</h1>
              <p className="text-lg text-muted-foreground">
                Generate and manage SEO analysis reports
              </p>
            </div>
          </div>
        </div>
        
        <Button className="btn-premium">
          <PlusIcon className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockReports.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockReports.filter(r => new Date(r.createdAt) > new Date('2024-01-01')).length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockReports.reduce((sum, r) => sum + r.downloads, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <DocumentArrowDownIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared Reports</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockReports.filter(r => r.shared).length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl">
                <ShareIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FunnelIcon className="mr-2 h-4 w-4" />
                Type: {selectedType === 'all' ? 'All' : reportTypeConfig[selectedType as keyof typeof reportTypeConfig]?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Report Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {reportTypes.map(type => (
                <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                  {type === 'all' ? 'All Types' : reportTypeConfig[type as keyof typeof reportTypeConfig]?.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {reportStatuses.map(status => (
                <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredReports.map((report, index) => {
          const typeConfig = reportTypeConfig[report.type]
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-r ${typeConfig.color} p-3 rounded-xl`}>
                        <typeConfig.icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {report.name}
                          </h3>
                          {getStatusBadge(report.status)}
                          {getFormatBadge(report.format)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <GlobeAltIcon className="h-4 w-4" />
                            <span>{report.project}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </span>
                          <span>{report.size}</span>
                          <span>{report.downloads} downloads</span>
                          {report.shared && (
                            <Badge variant="outline" className="text-xs">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {report.status === 'generating' ? (
                        <Button disabled size="sm">
                          <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <DocumentTextIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No reports found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedType !== 'all' || selectedStatus !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Generate your first report to get started"
            }
          </p>
          <Button className="btn-premium">
            <PlusIcon className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </motion.div>
      )}
    </div>
  )
}