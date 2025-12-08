import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Catalog.module.css";

// --- Интерфейсы ---

export interface Product {
  // ⬅️ ЭКСПОРТИРУЕМ ИНТЕРФЕЙС, чтобы его можно было использовать в App.tsx и CatalogPage.tsx
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  inStock: boolean;
  fullDescription?: string;
  features?: string[];
}

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  company: string;
  comment: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// Интерфейс для пропсов, которые Catalog теперь принимает
interface CatalogProps {
  selectedProducts: Product[];
  addToSelection: (product: Product) => void;
  removeFromSelection: (productId: number) => void;
  clearSelection: () => void;
}

// --- Компонент Catalog ---

// ⬅️ Принимаем пропсы CatalogProps
const Catalog: React.FC<CatalogProps> = ({
  selectedProducts,
  addToSelection,
  removeFromSelection,
  clearSelection,
}) => {
  // ❌ УДАЛЕНО: const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Оставляем только локальные состояния
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "inStock">("name");

  const [formData, setFormData] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    company: "",
    comment: "",
  });

  // Данные товаров (оставлены как в оригинале)
  const products: Product[] = useMemo(
    () => [
      {
        id: 1,
        name: "Электродвигатель АИР 80А2",
        category: "electric-motors",
        image: "https://via.placeholder.com/300x200",
        description:
          "Электродвигатель асинхронный трехфазный, мощность 1.5 кВт",
        price: "Цена по запросу",
        inStock: true,
      },
      {
        id: 2,
        name: "Частотный преобразователь ESQ900",
        category: "frequency-converters",
        image: "https://via.placeholder.com/300x200",
        description:
          "Преобразователь частоты для управления скоростью электродвигателей",
        price: "Цена по запросу",
        inStock: true,
      },
      {
        id: 3,
        name: "Пускатель ПМЛ 1100",
        category: "starters",
        image: "https://via.placeholder.com/300x200",
        description: "Магнитный пускатель для управления электродвигателями",
        price: "Цена по запросу",
        inStock: false,
      },
      {
        id: 4,
        name: "Реле контроля напряжения РН-113",
        category: "relays",
        image: "https://via.placeholder.com/300x200",
        description: "Реле для защиты оборудования от перепадов напряжения",
        price: "Цена по запросу",
        inStock: true,
      },
      {
        id: 5,
        name: "Электродвигатель АИР 90L4",
        category: "electric-motors",
        image: "https://via.placeholder.com/300x200",
        description:
          "Электродвигатель асинхронный трехфазный, мощность 2.2 кВт",
        price: "Цена по запросу",
        inStock: true,
      },
      {
        id: 6,
        name: "Кабель ВВГнг 3х2.5",
        category: "cables",
        image: "https://via.placeholder.com/300x200",
        description: "Кабель силовой медный с ПВХ изоляцией",
        price: "Цена по запросу",
        inStock: true,
      },
    ],
    []
  );

  // Категории
  const categories: Category[] = useMemo(
    () => [
      { id: "all", name: "Все категории", count: products.length },
      {
        id: "electric-motors",
        name: "Электродвигатели",
        count: products.filter((p) => p.category === "electric-motors").length,
      },
      {
        id: "frequency-converters",
        name: "Преобразователи частоты",
        count: products.filter((p) => p.category === "frequency-converters")
          .length,
      },
      {
        id: "starters",
        name: "Пускатели и контакторы",
        count: products.filter((p) => p.category === "starters").length,
      },
      {
        id: "relays",
        name: "Реле и датчики",
        count: products.filter((p) => p.category === "relays").length,
      },
      {
        id: "cables",
        name: "Кабельная продукция",
        count: products.filter((p) => p.category === "cables").length,
      },
    ],
    [products]
  );

  // Фильтрация и сортировка товаров (без изменений)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price.localeCompare(b.price);
        case "inStock":
          return a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // ❌ УДАЛЕНО: addToSelection/removeFromSelection/clearSelection были удалены изнутри компонента

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        products: selectedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
        })),
      };

      // Отправка заявки на backend API
      // Для Cloudflare Workers используйте: https://kpftse-telegram-api.your-subdomain.workers.dev
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      
      console.log('Отправка заявки на:', `${API_URL}/api/orders`);
      
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log('Ответ от сервера:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Парсим JSON ответ
      let result;
      try {
        const text = await response.text();
        console.log('Raw response text:', text);
        result = JSON.parse(text);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.error('Ошибка парсинга JSON ответа:', parseError);
        // Если ответ успешный, но не JSON, считаем успехом
        if (response.ok) {
          result = { success: true };
        } else {
          throw new Error('Неверный формат ответа от сервера');
        }
      }

      if (response.ok && (result.success || response.status === 200)) {
        // ⬅️ Используем пропс clearSelection
        clearSelection();
        setIsModalOpen(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          company: "",
          comment: "",
        });
        alert("Заявка отправлена! Менеджер свяжется с вами в ближайшее время.");
      } else {
        // Если есть сообщение об ошибке в ответе, используем его
        const errorMessage = result.error || "Ошибка при отправке заявки";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      
      let errorMessage = "Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.";
      
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className={styles.catalog}>
      <div className="container">
        <h1 className={styles.title}>Каталог продукции</h1>
        <p className={styles.subtitle}>
          Выберите интересующее оборудование и отправьте заявку
        </p>

        <div className={styles.catalogLayout}>
          {/* Сайдбар с фильтрами (без изменений) */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3>Поиск</h3>
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <h3>Категории</h3>
              <div className={styles.categoriesList}>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${styles.categoryButton} ${
                      selectedCategory === category.id
                        ? styles.categoryButtonActive
                        : ""
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={styles.categoryCount}>
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3>Сортировка</h3>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "price" | "inStock")
                }
                className={styles.sortSelect}
              >
                <option value="name">По названию</option>
                <option value="price">По цене</option>
                <option value="inStock">По наличию</option>
              </select>
            </div>

            {/* Выбранные товары */}
            {selectedProducts.length > 0 && ( // ⬅️ Используем пропс selectedProducts
              <div className={styles.selectionPanel}>
                <h3>Выбрано товаров: {selectedProducts.length}</h3>
                <button onClick={clearSelection} className={styles.clearButton}>
                  {" "}
                  {/* ⬅️ Используем пропс clearSelection */}
                  Очистить выбор
                </button>
              </div>
            )}
          </aside>

          {/* Основной контент */}
          <main className={styles.mainContent}>
            {/* ... фильтры */}
            <div className={styles.filtersInfo}>
              <span>
                Показано {filteredAndSortedProducts.length} из {products.length}{" "}
                товаров
                {selectedCategory !== "all" &&
                  ` в категории "${
                    categories.find((c) => c.id === selectedCategory)?.name
                  }"`}
                {searchTerm && ` по запросу "${searchTerm}"`}
              </span>
              {(selectedCategory !== "all" || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className={styles.clearFiltersButton}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
            {/* Сетка товаров */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredAndSortedProducts.map((product) => {
                  const isSelected = selectedProducts.some(
                    // ⬅️ Используем пропс selectedProducts
                    (p) => p.id === product.id
                  );
                  return (
                    // 1. Оборачиваем карточку в компонент Link
                    <Link
                      key={product.id}
                      to={`/catalog/${product.id}`} // Путь к детальной странице
                      className={styles.productCardLink} // Класс для стилизации Link
                    >
                      <div className={styles.productCard}>
                        <div className={styles.productImage}>
                          <img src={product.image} alt={product.name} />
                          <div className={styles.productCategory}>
                            {
                              categories.find((c) => c.id === product.category)
                                ?.name
                            }
                          </div>
                        </div>
                        <div className={styles.productInfo}>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className={styles.productMeta}>
                            <span className={styles.price}>
                              {product.price}
                            </span>
                            <span
                              className={`${styles.status} ${
                                product.inStock
                                  ? styles.inStock
                                  : styles.outOfStock
                              }`}
                            >
                              {product.inStock ? "В наличии" : "Под заказ"}
                            </span>
                          </div>
                          {/* 2. Используем if/else или тернарный оператор с явным вызовом (для ESLint) */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isSelected) {
                                // ⬅️ Используем if/else для чистоты кода
                                removeFromSelection(product.id);
                              } else {
                                addToSelection(product);
                              }
                            }}
                            className={`${styles.selectButton} ${
                              isSelected ? styles.selected : ""
                            }`}
                          >
                            {isSelected ? "Убрать" : "Выбрать"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noProducts}>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации или поиска</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className={styles.resetFiltersButton}
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Кнопка заявки */}
        {selectedProducts.length > 0 && ( // ⬅️ Используем пропс selectedProducts
          <div className={styles.floatingAction}>
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.orderButton}
            >
              Отправить заявку ({selectedProducts.length})
            </button>
          </div>
        )}

        {/* Модальное окно заявки */}
        {isModalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Отправить заявку</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>

              <form className={styles.modalForm} onSubmit={handleSubmit}>
                <div className={styles.selectedProducts}>
                  <h3>Выбранные товары ({selectedProducts.length})</h3>
                  <div className={styles.productsList}>
                    {selectedProducts.map((product) => (
                      <div key={product.id} className={styles.selectedProduct}>
                        <span>{product.name}</span>
                        <span>{product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company">Компания</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="comment">Комментарий</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Отправка..." : "Отправить заявку"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
