import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.company}>
            <h3>Техснабэлектрикс</h3>
            <p>
              Отечественный производитель запорной, регулирующей и
              трубопроводной арматуры
            </p>
          </div>

          <div className={styles.links}>
            <h4>Навигация</h4>
            <a href="/tse">Главная</a>
            <a href="/about">О компании</a>
            <a href="/products">Продукция</a>
            <a href="/standarts">Стандарты и сертификация</a>
          </div>

          <div className={styles.contact}>
            <h4>Контакты</h4>
            <p>+7 (727) 360-71-60</p>
            <p>infotse@kpf.kz</p>
            <p>г. Алматы, Алатауский район, ул. Барыс, 4</p>
          </div>

          <div className={styles.social}>
            <h4>Мы в соцсетях</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/tekhsnabelektriks/">
                Instagram
              </a>
              <a href="https://tlgg.ru/Tekhsnabelektriks">Telegram</a>
              <a href="https://wa.me/77754854274">WhatsApp</a>
              <a href="https://youtube.com/channel/UCz0sgjckEBP5KzKI4WyJd4g">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 Техснабэлектрикс. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
