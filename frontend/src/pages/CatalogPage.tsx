import React from "react";
import Catalog, { type Product } from "../components/Catalog/Catalog"; // Убедитесь, что вы экспортируете Product из Catalog

// Интерфейс для пропсов, которые передаются из App.tsx
interface CatalogPageProps {
  selectedProducts: Product[];
  addToSelection: (product: Product) => void;
  removeFromSelection: (productId: number) => void;
  clearSelection: () => void;
}

// Теперь компонент CatalogPage принимает пропсы
const CatalogPage: React.FC<CatalogPageProps> = (props) => {
  return (
    <div className="catalog-page">
      {/* Передаем все пропсы в дочерний компонент Catalog */}
      <Catalog
        selectedProducts={props.selectedProducts}
        addToSelection={props.addToSelection}
        removeFromSelection={props.removeFromSelection}
        clearSelection={props.clearSelection}
      />
    </div>
  );
};

export default CatalogPage;
