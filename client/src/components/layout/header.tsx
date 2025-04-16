import { useState } from "react";
import { Link } from "wouter";
import { Search } from "../ui/search";

const navItems = [
  { name: "Inicio", href: "/", active: true },
  { name: "Montañismo", href: "/categoria/montanismo", active: false },
  { name: "Senderismo", href: "/categoria/senderismo", active: false },
  { name: "Escalada", href: "/categoria/escalada", active: false },
  { name: "Talleres", href: "/categoria/talleres", active: false },
  { name: "Eventos", href: "/categoria/eventos", active: false },
  { name: "Equipamiento", href: "/categoria/equipamiento", active: false },
  { name: "Consejos", href: "/categoria/consejos", active: false },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top header with logo and search */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <i className="fas fa-mountain text-primary text-2xl mr-2"></i>
            <span className="font-heading font-bold text-xl md:text-2xl text-neutral-900">FameStream<span className="text-primary">News</span></span>
          </Link>
          
          {/* Search */}
          <Search />
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-700 focus:outline-none"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:block border-t border-neutral-200">
          <ul className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`px-4 py-2 font-semibold ${
                    item.active ? "text-primary" : "text-neutral-700"
                  } hover:bg-primary hover:bg-opacity-10 rounded-md`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} bg-white border-t border-neutral-200`}>
          <div className="p-4">
            <Search mobile placeholder="Buscar..." />
          </div>
          <ul className="py-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`block px-4 py-2 font-semibold ${
                    item.active ? "text-primary" : "text-neutral-700"
                  } hover:bg-primary hover:bg-opacity-10`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
