import React from "react";
import styles from "./Products.module.css";

const Products: React.FC = () => {
  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>НАША ПРОДУКЦИЯ</h2>
            <p className={styles.description}>
              для нефтегазовой отрасли, химического машиностроения, энергетики и
              металлургии и т.д.
            </p>
            <a href="/products" className={styles.link}>
              Узнать больше
            </a>
          </div>
          <div className={styles.imageContainer}>
            <img
              src="https://dummyimage.com/400x300/e2e8f0/64748b?text=Valve+Equipment"
              alt="Продукция Техснабэлектрикс"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
