import React from "react";
import styles from "./Hero.module.css";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Запорная, регулирующая и трубопроводная арматура от производителя
          </h1>
          <p className={styles.subtitle}>
            Отечественный товаропроизводитель с традиционным опытом производства
            и современными инновационными методами
          </p>
          <a href="#form" className={styles.cta}>
            Получить консультацию
          </a>
        </div>
        <div className={styles.videoContainer}>
          <iframe
            src="https://www.youtube.com/embed/QuAIhQp9zrs"
            title="Техснабэлектрикс 2022"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Hero;
