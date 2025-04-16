import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa tu correo electrónico",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Correo inválido",
        description: "Por favor, ingresa un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast({
        title: "¡Suscripción exitosa!",
        description: "Gracias por suscribirte a nuestro boletín informativo",
      });
    }, 1000);
  };

  return (
    <section className="bg-primary rounded-xl p-8 text-white mb-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Mantente informado</h2>
        <p className="mb-6">Suscríbete a nuestro boletín para recibir las noticias más importantes directamente en tu correo.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-grow px-4 py-3 rounded-lg text-neutral-800 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            className="bg-secondary hover:bg-opacity-90 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Suscribirse"}
          </Button>
        </form>
        
        <p className="text-xs mt-4 text-white text-opacity-80">
          Al suscribirte, aceptas nuestra política de privacidad y recibirás nuestro boletín informativo diario.
        </p>
      </div>
    </section>
  );
}
