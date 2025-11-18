import React, { useState, useMemo } from "react";
import styles from "./Catalog.module.css";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  inStock: boolean;
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

const Catalog: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
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
    comment: ""
  });

  // Данные товаров
  const products: Product[] = [
    {
      id: 1,
      name: "Электродвигатель АИР 80А2",
      category: "electric-motors",
      image: "https://via.placeholder.com/300x200",
      description: "Электродвигатель асинхронный трехфазный, мощность 1.5 кВт",
      price: "Цена по запросу",
      inStock: true
    },
    {
      id: 2,
      name: "Частотный преобразователь ESQ900",
      category: "frequency-converters",
      image: "https://via.placeholder.com/300x200",
      description: "Преобразователь частоты для управления скоростью электродвигателей",
      price: "Цена по запросу",
      inStock: true
    },
    {
      id: 3,
      name: "Пускатель ПМЛ 1100",
      category: "starters",
      image: "https://via.placeholder.com/300x200",
      description: "Магнитный пускатель для управления электродвигателями",
      price: "Цена по запросу",
      inStock: false
    },
    {
      id: 4,
      name: "Реле контроля напряжения РН-113",
      category: "relays",
      image: "https://via.placeholder.com/300x200",
      description: "Реле для защиты оборудования от перепадов напряжения",
      price: "Цена по запросу",
      inStock: true
    },
    {
      id: 5,
      name: "Электродвигатель АИР 90L4",
      category: "electric-motors",
      image: "https://via.placeholder.com/300x200",
      description: "Электродвигатель асинхронный трехфазный, мощность 2.2 кВт",
      price: "Цена по запросу",
      inStock: true
    },
    {
      id: 6,
      name: "Кабель ВВГнг 3х2.5",
      category: "cables",
      image: "https://via.placeholder.com/300x200",
      description: "Кабель силовой медный с ПВХ изоляцией",
      price: "Цена по запросу",
      inStock: true
    }
  ];

  // Категории
  const categories: Category[] = [
    { id: "all", name: "Все категории", count: products.length },
    { id: "electric-motors", name: "Электродвигатели", count: products.filter(p => p.category === "electric-motors").length },
    { id: "frequency-converters", name: "Преобразователи частоты", count: products.filter(p => p.category === "frequency-converters").length },
    { id: "starters", name: "Пускатели и контакторы", count: products.filter(p => p.category === "starters").length },
    { id: "relays", name: "Реле и датчики", count: products.filter(p => p.category === "relays").length },
    { id: "cables", name: "Кабельная продукция", count: products.filter(p => p.category === "cables").length }
  ];

  // Фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Фильтрация по категории
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Фильтрация по поиску
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Сортировка
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price.localeCompare(b.price);
        case "inStock":
          return (a.inStock === b.inStock) ? 0 : a.inStock ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const addToSelection = (product: Product) => {
    setSelectedProducts(prev => [...prev, product]);
  };

  const removeFromSelection = (productId: number) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        products: selectedProducts
      };

      // TODO: Заменить на ваш бэкенд URL
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearSelection();
        setIsModalOpen(false);
        setFormData({ name: "", phone: "", email: "", company: "", comment: "" });
        alert('Заявка отправлена! Менеджер свяжется с вами в ближайшее время.');
      } else {
        throw new Error('Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
          {/* Сайдбар с фильтрами */}
          <aside className={styles.sidebar}>
            {/* Поиск */}
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

            {/* Категории */}
            <div className={styles.filterGroup}>
              <h3>Категории</h3>
              <div className={styles.categoriesList}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${styles.categoryButton} ${
                      selectedCategory === category.id ? styles.categoryButtonActive : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={styles.categoryCount}>({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Сортировка */}
            <div className={styles.filterGroup}>
              <h3>Сортировка</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "price" | "inStock")}
                className={styles.sortSelect}
              >
                <option value="name">По названию</option>
                <option value="price">По цене</option>
                <option value="inStock">По наличию</option>
              </select>
            </div>

            {/* Выбранные товары */}
            {selectedProducts.length > 0 && (
              <div className={styles.selectionPanel}>
                <h3>Выбрано товаров: {selectedProducts.length}</h3>
                <button
                  onClick={clearSelection}
                  className={styles.clearButton}
                >
                  Очистить выбор
                </button>
              </div>
            )}
          </aside>

          {/* Основной контент */}
          <main className={styles.mainContent}>
            {/* Информация о фильтрах */}
            <div className={styles.filtersInfo}>
              <span>
                Показано {filteredAndSortedProducts.length} из {products.length} товаров
                {selectedCategory !== "all" && ` в категории "${categories.find(c => c.id === selectedCategory)?.name}"`}
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
                {filteredAndSortedProducts.map(product => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  return (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <img src={product.image} alt={product.name} />
                        <div className={styles.productCategory}>
                          {categories.find(c => c.id === product.category)?.name}
                        </div>
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className={styles.productMeta}>
                          <span className={styles.price}>{product.price}</span>
                          <span className={`${styles.status} ${
                            product.inStock ? styles.inStock : styles.outOfStock
                          }`}>
                            {product.inStock ? 'В наличии' : 'Под заказ'}
                          </span>
                        </div>
                        <button
                          onClick={() => isSelected ? removeFromSelection(product.id) : addToSelection(product)}
                          className={`${styles.selectButton} ${
                            isSelected ? styles.selected : ''
                          }`}
                        >
                          {isSelected ? 'Убрать' : 'Выбрать'}
                        </button>
                      </div>
                    </div>
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
        {selectedProducts.length > 0 && (
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
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Отправка заявки</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={styles.closeButton}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.selectedProducts}>
                  <h3>Выбранное оборудование:</h3>
                  <div className={styles.productsList}>
                    {selectedProducts.map(product => (
                      <div key={product.id} className={styles.selectedProduct}>
                        <span>{product.name}</span>
                        <span>{product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Имя *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ваше имя"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Компания</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Название компании"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Комментарий к заказу</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Дополнительная информация, пожелания..."
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className={styles.cancelButton}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedProducts.length === 0}
                    className={styles.submitButton}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
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