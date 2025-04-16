import { Facebook, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  large?: boolean;
}

export default function ShareButtons({ title, url, large = false }: ShareButtonsProps) {
  const fullUrl = window.location.origin + url;
  
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + fullUrl)}`;
        break;
      default:
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(fullUrl).then(() => {
          toast({
            title: "¡Enlace copiado!",
            description: "El enlace ha sido copiado al portapapeles",
          });
        });
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (large) {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => handleShare('twitter')}
          aria-label="Compartir en Twitter"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => handleShare('facebook')}
          aria-label="Compartir en Facebook"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => handleShare('whatsapp')}
          aria-label="Compartir por WhatsApp"
        >
          <Send className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <button 
        className="share-button hover:text-primary transition-colors" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare('twitter');
        }}
        aria-label="Compartir en Twitter"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button 
        className="share-button hover:text-primary transition-colors" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare('facebook');
        }}
        aria-label="Compartir en Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button 
        className="share-button hover:text-primary transition-colors" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare('whatsapp');
        }}
        aria-label="Compartir por WhatsApp"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
