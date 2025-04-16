import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <i className="fas fa-mountain text-primary text-2xl mr-2"></i>
              <span className="font-heading font-bold text-xl text-white">FameStream<span className="text-primary">News</span></span>
            </Link>
            <p className="text-neutral-400 text-sm mb-4">Tu portal de noticias, talleres y eventos para aventureros al aire libre.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-neutral-400 hover:text-primary"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-neutral-400 hover:text-primary"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-neutral-400 hover:text-primary"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-primary">Inicio</Link></li>
              <li><Link href="/noticias" className="text-neutral-400 hover:text-primary">Noticias</Link></li>
              <li><Link href="/talleres" className="text-neutral-400 hover:text-primary">Talleres</Link></li>
              <li><Link href="/eventos" className="text-neutral-400 hover:text-primary">Eventos</Link></li>
              <li><Link href="/sobre-nosotros" className="text-neutral-400 hover:text-primary">Sobre nosotros</Link></li>
              <li><Link href="/contacto" className="text-neutral-400 hover:text-primary">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li><Link href="/categoria/montanismo" className="text-neutral-400 hover:text-primary">Montañismo</Link></li>
              <li><Link href="/categoria/escalada" className="text-neutral-400 hover:text-primary">Escalada</Link></li>
              <li><Link href="/categoria/senderismo" className="text-neutral-400 hover:text-primary">Senderismo</Link></li>
              <li><Link href="/categoria/equipamiento" className="text-neutral-400 hover:text-primary">Equipamiento</Link></li>
              <li><Link href="/categoria/supervivencia" className="text-neutral-400 hover:text-primary">Supervivencia</Link></li>
              <li><Link href="/categoria/fotografia" className="text-neutral-400 hover:text-primary">Fotografía</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contáctanos</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>Calle Aventura, 123<br/>28001 Madrid, España</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span>+34 91 123 45 67</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>info@famestreamews.es</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} FameStreamNews. Todos los derechos reservados.</p>
          <div className="flex space-x-4 text-sm text-neutral-400">
            <a href="#" className="hover:text-primary">Términos y condiciones</a>
            <a href="#" className="hover:text-primary">Política de privacidad</a>
            <a href="#" className="hover:text-primary">Política de cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
