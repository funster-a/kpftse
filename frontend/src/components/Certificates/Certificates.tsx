import React from "react";
import styles from "./Certificates.module.css";

const Certificates: React.FC = () => {
  return (
    <section className={styles.certificates}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>СЕРТИФИКАТЫ</h2>
            <p className={styles.description}>
              ТОО «Техснабэлектрикс» является отечественным производителем и
              зарегистрирована в реестре отечественных товаропроизводителей АО
              «Фонд Национального Благосостояния "Самрук-Казына".
            </p>
            <a href="/standarts" className={styles.link}>
              Узнать больше
            </a>
          </div>
          <div className={styles.certificatesGrid}>
            <img
              src="https://dummyimage.com/200x280/e2e8f0/64748b?text=Certificate+1"
              alt="Сертификат 1"
            />
            <img
              src="https://dummyimage.com/200x280/e2e8f0/64748b?text=Certificate+2"
              alt="Сертификат 2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
