import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

export const metadata = {
  title: "Qline",
  description: "Smart queue management with AI insights and realtime notifications",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <html lang="en">
          <body>
            {children}
            <Toaster
              position="top-right"
              expand={true}
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  )
}
