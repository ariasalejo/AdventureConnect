import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white h-full w-4/5 max-w-sm p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Menú</h2>
          <button onClick={onClose} className="text-neutral-text">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categoria/${category.slug}`}>
                  <a
                    className="block py-2 text-neutral-text hover:text-primary font-medium"
                    onClick={onClose}
                  >
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
