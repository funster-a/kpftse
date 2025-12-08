import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./ProductPage.module.css";

// --- Интерфейсы и заглушка данных (как в предыдущем ответе) ---

import type { Product } from "../components/Catalog/Catalog";

interface ProductPageProps {
  selectedProducts: Product[];
  addToSelection: (product: Product) => void;
  removeFromSelection: (productId: number) => void;
}

// Заглушка данных (должна быть доступна для ProductPage)
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Электродвигатель АИР 80А2",
    category: "electric-motors",
    image: "https://via.placeholder.com/600x400",
    description: "Электродвигатель асинхронный трехфазный, мощность 1.5 кВт",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Трехфазный асинхронный электродвигатель серии АИР с короткозамкнутым ротором. Предназначен для привода механизмов, не требующих регулирования частоты вращения. Изготовлен в соответствии с ГОСТ 51689-2000. Обладает высокой надежностью и энергоэффективностью.",
    features: [
      "Мощность: 1.5 кВт",
      "Напряжение: 380 В",
      "Обороты: 3000 об/мин",
      "Степень защиты: IP54",
      "Класс изоляции: F",
      "КПД: 78%",
    ],
  },
  {
    id: 2,
    name: "Частотный преобразователь ESQ900",
    category: "frequency-converters",
    image: "https://via.placeholder.com/600x400",
    description:
      "Преобразователь частоты для управления скоростью электродвигателей",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Современный частотный преобразователь для плавного управления скоростью асинхронных электродвигателей. Обеспечивает экономию электроэнергии до 50% и продлевает срок службы оборудования.",
    features: [
      "Мощность: до 7.5 кВт",
      "Диапазон частот: 0-400 Гц",
      "Напряжение: 220/380 В",
      "Защита: IP20",
      "Режимы управления: скалярный, векторный",
    ],
  },
  {
    id: 3,
    name: "Пускатель ПМЛ 1100",
    category: "starters",
    image: "https://via.placeholder.com/600x400",
    description: "Магнитный пускатель для управления электродвигателями",
    price: "Цена по запросу",
    inStock: false,
    fullDescription:
      "Магнитный пускатель серии ПМЛ для дистанционного управления трехфазными асинхронными электродвигателями. Обеспечивает защиту от перегрузок и коротких замыканий.",
    features: [
      "Номинальный ток: 25 А",
      "Напряжение катушки: 220 В",
      "Степень защиты: IP54",
      "Количество контактов: 3NO",
    ],
  },
  {
    id: 4,
    name: "Реле контроля напряжения РН-113",
    category: "relays",
    image: "https://via.placeholder.com/600x400",
    description: "Реле для защиты оборудования от перепадов напряжения",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Реле контроля напряжения для защиты однофазных и трехфазных сетей от недопустимых отклонений напряжения. Автоматически отключает нагрузку при выходе напряжения за допустимые пределы.",
    features: [
      "Диапазон напряжения: 100-400 В",
      "Время срабатывания: 0.1-10 с",
      "Ток нагрузки: до 16 А",
      "Точность: ±2%",
    ],
  },
  {
    id: 5,
    name: "Электродвигатель АИР 90L4",
    category: "electric-motors",
    image: "https://via.placeholder.com/600x400",
    description:
      "Электродвигатель асинхронный трехфазный, мощность 2.2 кВт",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Трехфазный асинхронный электродвигатель серии АИР с короткозамкнутым ротором. Предназначен для привода механизмов, не требующих регулирования частоты вращения.",
    features: [
      "Мощность: 2.2 кВт",
      "Напряжение: 380 В",
      "Обороты: 1500 об/мин",
      "Степень защиты: IP54",
      "Класс изоляции: F",
      "КПД: 82%",
    ],
  },
  {
    id: 6,
    name: "Кабель ВВГнг 3х2.5",
    category: "cables",
    image: "https://via.placeholder.com/600x400",
    description: "Кабель силовой медный с ПВХ изоляцией",
    price: "Цена по запросу",
    inStock: true,
    fullDescription:
      "Силовой кабель с медными жилами и ПВХ изоляцией. Не распространяет горение, предназначен для прокладки в сухих и влажных помещениях, каналах, туннелях.",
    features: [
      "Сечение: 3×2.5 мм²",
      "Напряжение: до 660 В",
      "Температура: -50°C до +50°C",
      "Стандарт: ГОСТ 31996-2012",
    ],
  },
];

// --- Компонент ProductPage ---

const ProductPage: React.FC<ProductPageProps> = ({
  selectedProducts,
  addToSelection,
  removeFromSelection,
}) => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "", 10);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = mockProducts.find((p) => p.id === productId);

  // Генерируем несколько изображений для галереи (в реальном приложении это будут реальные изображения)
  const productImages = [
    product?.image || "https://via.placeholder.com/600x400",
    "https://via.placeholder.com/600x400?text=Image+2",
    "https://via.placeholder.com/600x400?text=Image+3",
    "https://via.placeholder.com/600x400?text=Image+4",
  ];

  if (!product) {
    return (
      <section className={styles.productPage}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>😔 Товар не найден</h1>
            <p>К сожалению, товар с таким ID не существует</p>
            <Link to="/catalog" className={styles.backLink}>
              ← Вернуться в каталог
            </Link>
          </div>
        </div>
      </section>
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
    <section className={styles.productPage}>
      <div className={styles.container}>
        <Link to="/catalog" className={styles.backLink}>
          ← Вернуться в каталог
        </Link>

        <div className={styles.productDetailLayout}>
          {/* Левая часть: Изображение и галерея */}
          <div>
            <div className={styles.productDetailImage}>
              <img
                src={productImages[selectedImage]}
                alt={product.name}
              />
            </div>
            {productImages.length > 1 && (
              <div className={styles.imageGallery}>
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`${styles.galleryThumb} ${
                      selectedImage === index ? styles.active : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} - вид ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Правая часть: Описание и характеристики */}
          <div className={styles.productDetailInfo}>
            <h1 className={styles.productTitle}>{product.name}</h1>

            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.priceSection}>
              <p className={styles.price}>{product.price}</p>
              <span
                className={`${styles.status} ${
                  product.inStock ? styles.inStock : styles.outOfStock
                }`}
              >
                {product.inStock ? "В наличии" : "Под заказ"}
              </span>
            </div>

            {product.fullDescription && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Подробное описание</h3>
                <p className={styles.sectionContent}>
                  {product.fullDescription}
                </p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Основные характеристики</h3>
                <ul className={styles.featuresList}>
                  {product.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className={`${styles.actionButton} ${
                isSelected
                  ? styles.actionButtonDanger
                  : styles.actionButtonPrimary
              }`}
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
