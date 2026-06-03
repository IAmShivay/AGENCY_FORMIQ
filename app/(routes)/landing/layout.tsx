import { ReactNode } from 'react';
import Link from 'next/link';
import { Terminal, Phone, Mail } from 'lucide-react';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Minimal header with just logo and contact info */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 relative group">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg overflow-hidden">
                <Terminal className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl font-bold">
                Infi<span className="text-primary">Labs</span>
              </div>
            </Link>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center group cursor-pointer">
                <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mr-2 group-hover:bg-green-200 transition-colors">
                  <Phone className="w-3 h-3 text-green-600" />
                </div>
                <span className="mr-1">🇮🇳</span>
                <span className="text-muted-foreground group-hover:text-green-600 transition-colors font-medium">+91 89183 49445</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full mr-2 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-3 h-3 text-primary" />
                </div>
                <span className="mr-1">🇺🇸</span>
                <span className="text-muted-foreground group-hover:text-primary transition-colors font-medium">+1 224-523-8210</span>
              </div>
              <div className="flex items-center group cursor-pointer">
                <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full mr-2 group-hover:bg-purple-200 transition-colors">
                  <Mail className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-muted-foreground group-hover:text-purple-600 transition-colors font-medium">hello@formiqstudio.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="bg-muted/30 py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <div className="text-lg font-semibold">
                Formiq<span className="text-primary">Studio</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Transforming businesses through innovative software solutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
              <span className="text-muted-foreground">© 2024 FormiqStudio. All rights reserved.</span>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline font-medium cursor-pointer"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link
                href="/terms"
                className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline font-medium cursor-pointer"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
