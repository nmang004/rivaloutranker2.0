"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  PlusIcon,
  FolderIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { 
  FolderIcon as FolderIconSolid,
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

interface Project {
  id: string
  name: string
  url: string
  currentScore: number
  previousScore: number
  lastAudit: string
  nextAudit: string
  auditsCount: number
  status: 'active' | 'paused' | 'completed'
  category: string
  issues: {
    critical: number
    warning: number
    info: number
  }
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    url: 'https://example-store.com',
    currentScore: 85,
    previousScore: 78,
    lastAudit: '2024-01-15',
    nextAudit: '2024-01-22',
    auditsCount: 12,
    status: 'active',
    category: 'E-commerce',
    issues: { critical: 2, warning: 8, info: 15 }
  },
  {
    id: '2',
    name: 'Corporate Blog',
    url: 'https://company-blog.com',
    currentScore: 72,
    previousScore: 69,
    lastAudit: '2024-01-14',
    nextAudit: '2024-01-21',
    auditsCount: 8,
    status: 'active',
    category: 'Blog',
    issues: { critical: 5, warning: 12, info: 18 }
  },
  {
    id: '3',
    name: 'Local Service Business',
    url: 'https://local-services.com',
    currentScore: 91,
    previousScore: 88,
    lastAudit: '2024-01-13',
    nextAudit: '2024-01-20',
    auditsCount: 15,
    status: 'active',
    category: 'Local Business',
    issues: { critical: 1, warning: 4, info: 8 }
  },
  {
    id: '4',
    name: 'Portfolio Website',
    url: 'https://designer-portfolio.com',
    currentScore: 67,
    previousScore: 71,
    lastAudit: '2024-01-12',
    nextAudit: '2024-01-19',
    auditsCount: 5,
    status: 'paused',
    category: 'Portfolio',
    issues: { critical: 8, warning: 15, info: 22 }
  }
]

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

const getTrendIcon = (current: number, previous: number) => {
  if (current > previous) {
    return <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
  } else if (current < previous) {
    return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
  }
  return null
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">Active</Badge>
    case 'paused':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">Paused</Badge>
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">Completed</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(mockProjects.map(p => p.category)))]

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
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl">
              <FolderIconSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">Projects</h1>
              <p className="text-lg text-muted-foreground">
                Manage and track your website SEO performance
              </p>
            </div>
          </div>
        </div>
        
        <Button className="btn-premium">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
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
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{mockProjects.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(mockProjects.reduce((sum, p) => sum + p.currentScore, 0) / mockProjects.length)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                <ChartBarIconSolid className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {mockProjects.reduce((sum, p) => sum + p.auditsCount, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl">
                <DocumentMagnifyingGlassIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="card-interactive h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {project.name}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span className="truncate">{project.url}</span>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DocumentMagnifyingGlassIcon className="mr-2 h-4 w-4" />
                        Run Audit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 dark:text-red-400">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(project.currentScore)}`}>
                      {project.currentScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Current Score</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(project.currentScore, project.previousScore)}
                    <span className="text-sm text-muted-foreground">
                      {project.currentScore > project.previousScore ? '+' : ''}
                      {project.currentScore - project.previousScore}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${getScoreBgColor(project.currentScore)}`}>
                    <ChartBarIcon className={`h-6 w-6 ${getScoreColor(project.currentScore)}`} />
                  </div>
                </div>

                {/* Issues Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Issues</span>
                    <span className="font-medium">
                      {project.issues.critical + project.issues.warning + project.issues.info} total
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-red-100 dark:bg-red-950/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-medium text-red-600 dark:text-red-400">
                        {project.issues.critical}
                      </div>
                      <div className="text-xs text-red-500 dark:text-red-500">Critical</div>
                    </div>
                    <div className="flex-1 bg-amber-100 dark:bg-amber-950/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {project.issues.warning}
                      </div>
                      <div className="text-xs text-amber-500 dark:text-amber-500">Warning</div>
                    </div>
                    <div className="flex-1 bg-blue-100 dark:bg-blue-950/50 rounded-lg p-2 text-center">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {project.issues.info}
                      </div>
                      <div className="text-xs text-blue-500 dark:text-blue-500">Info</div>
                    </div>
                  </div>
                </div>

                {/* Audit Schedule */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Last audit: {new Date(project.lastAudit).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.auditsCount} audits
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next audit: {new Date(project.nextAudit).toLocaleDateString()}
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Link href={`/results/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                  </Link>
                  <Link href="/auditor" className="flex-1">
                    <Button size="sm" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <DocumentMagnifyingGlassIcon className="mr-2 h-4 w-4" />
                      Run Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <FolderIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Get started by creating your first project"
            }
          </p>
          <Button className="btn-premium">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </motion.div>
      )}
    </div>
  )
}