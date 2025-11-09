import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      title: "Accounting Services",
      href: "/services/accounting",
      description: "Bookkeeping, financial statements, and payroll support",
    },
    {
      title: "Tax Services",
      href: "/services/tax",
      description: "Individual & business tax preparation and IRS representation",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "shadow-custom-md backdrop-blur-md"
          : "backdrop-blur-sm"
      )}
      style={{
        backgroundColor: 'rgb(249 249 232 / 85%)'
      }}
    >
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:(860)456-1661" className="flex items-center gap-2 hover:text-accent transition-fast">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(860) 456-1661</span>
            </a>
            <a href="mailto:info@sp-financial.com" className="flex items-center gap-2 hover:text-accent transition-fast">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">info@sp-financial.com</span>
            </a>
          </div>
          <div className="text-xs hidden md:block">452 Jackson Street, Willimantic, CT 06226</div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom pb-4 pt-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
              Spalding & Partners
            </h1>
            <p className="text-sm text-muted-foreground">Financial Services, LLC</p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-muted-foreground"
              )}
            >
              About Us
            </Link>
            <Link
              to="/staff"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/staff") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Our Team
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover">
                      {services.map((service) => (
                        <li key={service.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={service.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {service.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {service.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/resources"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/resources") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/faq") ? "text-primary" : "text-muted-foreground"
              )}
            >
              FAQ
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild variant="outline" size="lg">
              <Link to="/client-portal">Client Portal</Link>
            </Button>
            <Button asChild variant="cta" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 space-y-4">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/staff"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Team
            </Link>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Services</div>
              {services.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  className="block pl-4 py-2 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {service.title}
                </Link>
              ))}
            </div>

            <Link
              to="/resources"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/client-portal" onClick={() => setIsMobileMenuOpen(false)}>
                  Client Portal
                </Link>
              </Button>
              <Button asChild variant="cta" size="lg" className="w-full">
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
