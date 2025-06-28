"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  UsersIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  UserCircleIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { 
  UsersIcon as UsersIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
  avatar?: string
  permissions: string[]
  projectsAccess: number
  auditsCompleted: number
}

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  projectCount: number
  subscription: 'free' | 'professional' | 'enterprise'
  createdAt: string
}

const mockTeam: Team = {
  id: '1',
  name: 'SEO Analytics Team',
  description: 'Professional SEO analysis and optimization team',
  memberCount: 8,
  projectCount: 42,
  subscription: 'professional',
  createdAt: '2023-06-15T10:00:00Z'
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Nick Mangubat',
    email: 'nick@rivaloutranker.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2023-06-15T10:00:00Z',
    lastActive: '2024-01-15T16:30:00Z',
    permissions: ['all'],
    projectsAccess: 42,
    auditsCompleted: 1247
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2023-07-20T14:15:00Z',
    lastActive: '2024-01-15T15:45:00Z',
    permissions: ['manage_projects', 'run_audits', 'view_reports'],
    projectsAccess: 38,
    auditsCompleted: 342
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'member',
    status: 'active',
    joinedAt: '2023-08-10T09:30:00Z',
    lastActive: '2024-01-15T14:20:00Z',
    permissions: ['run_audits', 'view_reports'],
    projectsAccess: 15,
    auditsCompleted: 89
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'member',
    status: 'active',
    joinedAt: '2023-09-05T11:45:00Z',
    lastActive: '2024-01-15T13:10:00Z',
    permissions: ['run_audits', 'view_reports'],
    projectsAccess: 22,
    auditsCompleted: 156
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david.park@company.com',
    role: 'viewer',
    status: 'active',
    joinedAt: '2023-10-12T16:20:00Z',
    lastActive: '2024-01-14T17:30:00Z',
    permissions: ['view_reports'],
    projectsAccess: 8,
    auditsCompleted: 0
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    role: 'member',
    status: 'pending',
    joinedAt: '2024-01-10T12:00:00Z',
    lastActive: '—',
    permissions: ['run_audits', 'view_reports'],
    projectsAccess: 0,
    auditsCompleted: 0
  }
]

const roleConfig = {
  owner: {
    name: 'Owner',
    icon: ShieldCheckIconSolid,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
  },
  admin: {
    name: 'Admin',
    icon: ShieldCheckIcon,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  },
  member: {
    name: 'Member',
    icon: UserCircleIcon,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
  },
  viewer: {
    name: 'Viewer',
    icon: UserCircleIcon,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    textColor: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-200'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">Active</Badge>
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">Pending</Badge>
    case 'inactive':
      return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-200">Inactive</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const roles = ['all', ...Array.from(new Set(mockMembers.map(m => m.role)))]
  const statuses = ['all', ...Array.from(new Set(mockMembers.map(m => m.status)))]

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
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-3 rounded-xl">
              <UsersIconSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">Team Management</h1>
              <p className="text-lg text-muted-foreground">
                Manage team members and their permissions
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <CogIcon className="mr-2 h-4 w-4" />
            Team Settings
          </Button>
          <Button className="btn-premium">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </motion.div>

      {/* Team Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockTeam.name}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {mockTeam.description}
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 capitalize">
                {mockTeam.subscription} Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockTeam.memberCount}
                </div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockTeam.projectCount}
                </div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockMembers.reduce((sum, m) => sum + m.auditsCompleted, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Audits</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockMembers.filter(m => m.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
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
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
        
        <div className="flex gap-2">
          {roles.map(role => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole(role)}
              className="capitalize"
            >
              {role === 'all' ? 'All Roles' : roleConfig[role as keyof typeof roleConfig]?.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredMembers.map((member, index) => {
          const roleData = roleConfig[member.role]
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${roleData.color} flex items-center justify-center`}>
                            <span className="text-white font-medium text-sm">
                              {getInitials(member.name)}
                            </span>
                          </div>
                        )}
                        {member.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {member.name}
                          </h3>
                          <Badge className={roleData.badge}>
                            {roleData.name}
                          </Badge>
                          {getStatusBadge(member.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <EnvelopeIcon className="h-4 w-4" />
                            <span>{member.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              {member.status === 'pending' 
                                ? `Invited ${new Date(member.joinedAt).toLocaleDateString()}`
                                : `Last active ${new Date(member.lastActive).toLocaleDateString()}`
                              }
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <ChartBarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-slate-600 dark:text-slate-400">
                              {member.projectsAccess} projects
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DocumentMagnifyingGlassIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-slate-600 dark:text-slate-400">
                              {member.auditsCompleted} audits
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          <EnvelopeIcon className="mr-2 h-4 w-4" />
                          Resend Invite
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <UserCircleIconSolid className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShieldCheckIcon className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {member.role !== 'owner' && (
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <UsersIcon className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No team members found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Invite team members to start collaborating"
            }
          </p>
          <Button className="btn-premium">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Invite Team Member
          </Button>
        </motion.div>
      )}

      {/* Role Permissions Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Role Permissions
            </CardTitle>
            <CardDescription>
              Understanding team member access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(roleConfig).map(([role, config]) => (
                <div key={role} className={`p-4 rounded-xl ${config.bgColor} border border-opacity-50`}>
                  <div className="flex items-center space-x-2 mb-3">
                    <config.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {config.name}
                    </h3>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {role === 'owner' && (
                      <>
                        <li>• Full admin access</li>
                        <li>• Manage billing</li>
                        <li>• Team settings</li>
                        <li>• All permissions</li>
                      </>
                    )}
                    {role === 'admin' && (
                      <>
                        <li>• Manage projects</li>
                        <li>• Run audits</li>
                        <li>• View all reports</li>
                        <li>• Invite members</li>
                      </>
                    )}
                    {role === 'member' && (
                      <>
                        <li>• Run audits</li>
                        <li>• View reports</li>
                        <li>• Assigned projects</li>
                        <li>• Basic analytics</li>
                      </>
                    )}
                    {role === 'viewer' && (
                      <>
                        <li>• View reports only</li>
                        <li>• Limited projects</li>
                        <li>• Read-only access</li>
                        <li>• No audit creation</li>
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}