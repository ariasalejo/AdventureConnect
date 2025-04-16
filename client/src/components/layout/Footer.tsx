import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

export default function Footer() {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <footer className="bg-[#202124] text-white pt-10 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">FameStream</h4>
            <p className="text-gray-300 text-sm">
              Tu fuente confiable de noticias al día. Información actualizada, análisis profundo y coberturas especiales para mantenerte informado.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Secciones</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link href={`/categoria/${category.slug}`}>
                    <a className="text-gray-300 hover:text-white transition-colors text-sm">
                      {category.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Utilidades</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Última hora</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Lo más leído</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Opinión</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Multimedia</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Newsletter</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>Calle Gran Vía 28, 28013 Madrid, España</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2"></i>
                <span>+34 91 123 45 67</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>contacto@famestream.es</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} FameStream News. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
