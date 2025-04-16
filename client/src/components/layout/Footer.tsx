import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import type { Category } from "@shared/schema";

export default function Footer() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">FameStream News</h3>
            <p className="text-neutral-300 text-sm mb-4">
              Portal de noticias comprometido con la información veraz y oportuna 
              para mantener a la ciudadanía informada sobre los eventos más relevantes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Categorías</h3>
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link href={`/categoria/${category.slug}`}>
                    <a className="text-neutral-300 hover:text-white transition-colors">
                      {category.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-300 hover:text-white transition-colors">Inicio</a>
                </Link>
              </li>
              <li>
                <Link href="/articulo/nuevos">
                  <a className="text-neutral-300 hover:text-white transition-colors">Más Recientes</a>
                </Link>
              </li>
              <li>
                <Link href="/articulo/populares">
                  <a className="text-neutral-300 hover:text-white transition-colors">Más Populares</a>
                </Link>
              </li>
              <li>
                <Link href="/archivo">
                  <a className="text-neutral-300 hover:text-white transition-colors">Archivos</a>
                </Link>
              </li>
              <li>
                <Link href="/temas-especiales">
                  <a className="text-neutral-300 hover:text-white transition-colors">Temas Especiales</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Contacto</h3>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>Avenida de la Prensa 123, Ciudad Principal</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>contacto@famestream.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} FameStream News. Todos los derechos reservados.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
