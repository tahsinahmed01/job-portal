import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Hired — Find Your Dream Job',
  description: 'Job Portal for Modern Talent',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
