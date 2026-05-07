import React from "react";
import {
  Shirt,
  Smartphone,
  Sofa,
  CarFront as Car,
  Book,
  Tent,
  Cat,
  Gamepad2,
  Baby,
  Package,
  Tags,
} from "lucide-react";

interface CategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export function CategoryIcon({ iconName, className }: CategoryIconProps) {
  switch (iconName) {
    case "Shirt":
      return <Shirt className={className} />;
    case "Smartphone":
      return <Smartphone className={className} />;
    case "Sofa":
      return <Sofa className={className} />;
    case "Car":
      return <Car className={className} />;
    case "Book":
      return <Book className={className} />;
    case "Tent":
      return <Tent className={className} />;
    case "Cat":
      return <Cat className={className} />;
    case "Gamepad2":
      return <Gamepad2 className={className} />;
    case "Baby":
      return <Baby className={className} />;
    case "Package":
      return <Package className={className} />;
    default:
      return <Tags className={className} />;
  }
}
