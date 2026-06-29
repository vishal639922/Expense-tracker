import { 
  Utensils, 
  ShoppingBag, 
  Home, 
  Car, 
  Tv, 
  Heart, 
  Apple, 
  HelpCircle 
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export default function CategoryIcon({ iconName, className = '', size = 18 }: CategoryIconProps) {
  const props = { className, size };
  
  switch (iconName) {
    case 'Utensils':
      return <Utensils {...props} id={`icon-utensils-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} id={`icon-shopping-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'Home':
      return <Home {...props} id={`icon-home-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'Car':
      return <Car {...props} id={`icon-car-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'Tv':
      return <Tv {...props} id={`icon-tv-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'Heart':
      return <Heart {...props} id={`icon-heart-${Math.random().toString(36).substr(2, 4)}`} />;
    case 'Apple':
      return <Apple {...props} id={`icon-apple-${Math.random().toString(36).substr(2, 4)}`} />;
    default:
      return <HelpCircle {...props} id={`icon-other-${Math.random().toString(36).substr(2, 4)}`} />;
  }
}
