import { Heart, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    role: 'Donor' | 'NGO';
  } | null;
  onLogout?: () => void;
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DonateWear
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, <span className="font-medium text-foreground">{user.name}</span>
                    <span className="ml-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {user.role}
                    </span>
                  </span>
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost">Login</Button>
                  <Button variant="hero" size="sm">Sign Up</Button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.name} ({user.role})</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                  <Button variant="hero" className="w-full">Sign Up</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 gradient-primary rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-semibold text-foreground">DonateWear</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting generous hearts with those in need, one clothing item at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}