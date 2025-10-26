import React, { useState } from "react";
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

const Catalog: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    company: "",
    comment: ""
  });

  // Ваши данные товаров
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
    }
  ];

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

        <div className={styles.catalogContent}>
          {/* Сетка товаров */}
          <div className={styles.productsGrid}>
            {products.map(product => {
              const isSelected = selectedProducts.some(p => p.id === product.id);
              return (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
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