import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  User as UserIcon,
  Menu,
  X
} from "lucide-react";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = user ? [
    { name: "Dashboard", path: user.role === "instructor" ? "/instructor/dashboard" : "/student/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/courses", icon: BookOpen },
    ...(user.role === "admin" ? [{ name: "Admin", path: "/admin", icon: UserIcon }] : []),
  ] : [
    { name: "Courses", path: "/courses", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <BookOpen size={24} />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">CLMS</span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-medium text-slate-900">{user.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut size={18} className="text-slate-500" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-500 hover:text-slate-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-500 hover:text-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-500 hover:text-slate-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1 rounded text-white">
                  <BookOpen size={20} />
                </div>
                <span className="text-lg font-bold text-slate-900">CLMS</span>
              </div>
              <p className="text-slate-500 max-w-xs">
                Empowering the next generation of learners with AI-powered personalized education.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-slate-500 hover:text-indigo-600">Courses</Link></li>
                <li><Link to="/instructors" className="text-slate-500 hover:text-indigo-600">Instructors</Link></li>
                <li><Link to="/pricing" className="text-slate-500 hover:text-indigo-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-slate-500 hover:text-indigo-600">Help Center</Link></li>
                <li><Link to="/contact" className="text-slate-500 hover:text-indigo-600">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-slate-500 hover:text-indigo-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2024 CLMS Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
