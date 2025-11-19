import React from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../components/Catalog/Catalog.module.css"; // Используем стили из Catalog

// --- Интерфейсы и заглушка данных (как в предыдущем ответе) ---

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  inStock: boolean;
  fullDescription: string;
  features: string[];
}

interface ProductPageProps {
  selectedProducts: Product[];
  addToSelection: (product: Product) => void;
  removeFromSelection: (productId: number) => void;
}

// Заглушка данных (должна быть доступна для ProductPage)
const mockProducts: Product[] = [
  {
    id: 6,
    name: "Электродвигатель АИР 80А2",
    category: "electric-motors",
    image: "https://via.placeholder.com/600x400",
    description: "Электродвигатель асинхронный трехфазный, мощность 1.5 кВт",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Трехфазный асинхронный электродвигатель серии АИР с короткозамкнутым ротором. Предназначен для привода механизмов, не требующих регулирования частоты вращения.",
    features: [
      "Мощность: 1.5 кВт",
      "Напряжение: 380 В",
      "Обороты: 3000 об/мин",
      "Степень защиты: IP54",
    ],
  },
  // ... другие товары
];

// --- Компонент ProductPage ---

const ProductPage: React.FC<ProductPageProps> = ({
  selectedProducts,
  addToSelection,
  removeFromSelection,
}) => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "", 10);

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="container" style={{ padding: "60px 20px" }}>
        <h1 style={{ textAlign: "center" }}>😔 Товар не найден</h1>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/catalog">Вернуться в каталог</Link>
        </p>
      </div>
    );
  }

  // Проверяем, выбран ли товар
  const isSelected = selectedProducts.some((p) => p.id === product.id);

  const handleSelectClick = () => {
    if (isSelected) {
      removeFromSelection(product.id);
    } else {
      addToSelection(product);
    }
  };

  return (
    <section className={styles.catalog} style={{ padding: "60px 0" }}>
      <div
        className="container"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
      >
        <Link
          to="/catalog"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#3b82f6",
            textDecoration: "none",
          }}
        >
          &larr; Вернуться в каталог
        </Link>

        <div
          className={styles.productDetailLayout}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Левая часть: Изображение */}
          <div className={styles.productDetailImage}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>

          {/* Правая часть: Описание и характеристики */}
          <div className={styles.productDetailInfo}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "10px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
                fontSize: "1.125rem",
              }}
            >
              {product.description}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#10b981",
                }}
              >
                {product.price}
              </span>
              <span
                className={`${styles.status} ${
                  product.inStock ? styles.inStock : styles.outOfStock
                }`}
                style={{ marginLeft: "15px" }}
              >
                {product.inStock ? "В наличии" : "Под заказ"}
              </span>
            </div>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1f2937",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Подробное описание
            </h3>
            <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
              {product.fullDescription}
            </p>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1f2937",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Основные характеристики
            </h3>
            <ul
              style={{
                listStyleType: "disc",
                marginLeft: "20px",
                color: "#4b5563",
              }}
            >
              {product.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Замена кнопки "Оставить заявку" на кнопку "Выбрать/Убрать" */}
            <button
              style={{
                marginTop: "30px",
                padding: "1rem 2rem",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
                backgroundColor: isSelected ? "#ef4444" : "#3b82f6", // Красный если выбран, синий если нет
                color: "white",
              }}
              onClick={handleSelectClick}
            >
              {isSelected ? "Убрать из заявки" : "Добавить в заявку"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
