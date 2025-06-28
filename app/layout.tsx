import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { TanStackQueryProvider } from '@/components/providers/tanstack-query-provider'
import { WebSocketProvider } from '@/components/providers/websocket-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RivalOutRanker 2.0 - Professional SEO Analysis Platform',
  description: 'The most sophisticated SEO analysis platform with 140+ factor analysis, AI-powered insights, and enterprise-grade features.',
  keywords: ['SEO', 'analysis', 'audit', 'AI insights', 'professional', 'enterprise'],
  authors: [{ name: 'Nick Mangubat' }],
  creator: 'Nick Mangubat',
  publisher: 'RivalOutRanker',
  robots: 'index, follow',
  metadataBase: new URL('https://rivaloutranker.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rivaloutranker.com',
    title: 'RivalOutRanker 2.0 - Professional SEO Analysis Platform',
    description: 'The most sophisticated SEO analysis platform with 140+ factor analysis, AI-powered insights, and enterprise-grade features.',
    siteName: 'RivalOutRanker 2.0',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RivalOutRanker 2.0 - Professional SEO Analysis Platform',
    description: 'The most sophisticated SEO analysis platform with 140+ factor analysis, AI-powered insights, and enterprise-grade features.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackQueryProvider>
            <WebSocketProvider>
            <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                  <div className="container mx-auto p-6 space-y-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Toaster 
              position="top-right"
              expand={true}
              richColors
              closeButton
            />
            </WebSocketProvider>
          </TanStackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}