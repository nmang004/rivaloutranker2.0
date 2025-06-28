"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  Cog6ToothIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const integrations = [
  {
    name: "Google Analytics",
    description: "Connect your GA4 property for enhanced insights",
    status: "connected",
    icon: "🔗"
  },
  {
    name: "Google Search Console", 
    description: "Import search performance data",
    status: "disconnected",
    icon: "🔍"
  },
  {
    name: "Google PageSpeed Insights",
    description: "Automated Core Web Vitals monitoring",
    status: "connected",
    icon: "⚡"
  },
  {
    name: "Ahrefs API",
    description: "Backlink analysis and keyword data",
    status: "disconnected", 
    icon: "📊"
  }
]

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    critical: true
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheckIcon className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <GlobeAltIcon className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="Enter your first name" defaultValue="Nick" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Enter your last name" defaultValue="Mangubat" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input placeholder="Enter your email" defaultValue="nick@rivaloutranker.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input placeholder="Enter your company name" defaultValue="RivalOutRanker" />
              </div>
              <Button className="btn-premium">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about audit completions and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'weekly', label: 'Weekly Reports', description: 'Automated weekly SEO reports' },
                { key: 'critical', label: 'Critical Alerts', description: 'Important security and error alerts' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button
                    variant={notifications[item.key as keyof typeof notifications] ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifications]
                    }))}
                  >
                    {notifications[item.key as keyof typeof notifications] ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="btn-premium">
                  Update Password
                </Button>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <KeyIcon className="h-4 w-4" />
                  API Access
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Your API key for programmatic access to RivalOutRanker
                  </p>
                  <div className="flex gap-2">
                    <Input 
                      value="ro_api_xxxxxxxxxxxxxxxxxxxxxxxx" 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button variant="outline">Copy</Button>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-premium p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      140+ factors, unlimited audits, AI insights
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$99/month</span>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Payment Method</h4>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded text-white text-sm flex items-center justify-center font-medium">
                      💳
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>
                Connect external services to enhance your SEO analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {integrations.map((integration, index) => (
                  <motion.div
                    key={integration.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {integration.name}
                          {integration.status === 'connected' && (
                            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={integration.status === 'connected' ? "outline" : "default"}
                      size="sm"
                      className={integration.status === 'connected' ? "" : "btn-premium"}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}