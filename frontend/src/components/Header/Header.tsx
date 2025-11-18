import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img
            src="https://static.tildacdn.pro/tild3833-3565-4435-b631-356566613162/IMG_6442.PNG"
            alt="Техснабэлектрикс"
          />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Главная
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? styles.active : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            О нас
          </Link>
          <Link
            to="/catalog"
            className={location.pathname === "/catalog" ? styles.active : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            Продукция
          </Link>
          <div className={styles.dropdown}>
            <span>Прайс</span>
            <div className={styles.dropdownContent}>
              <a href="https://kpf.kz/files/1.pdf">Прайс Техснабэлектрикс</a>
              <a href="https://kpf.kz/files/2.pdf">
                Прайс ремонт Техснабэлектрикс
              </a>
            </div>
          </div>
          <a href="/3" onClick={() => setIsMenuOpen(false)}>
            Контакты
          </a>
        </nav>

        <div className={styles.headerActions}>
          <a href="tel:+7 (727) 360-71-60" className={styles.phone}>
            +7 (727) 360-71-60
          </a>
          <div className={styles.socialLinks}>
            <a href="https://tlgg.ru/Tekhsnabelektriks" title="Telegram">
              TG
            </a>
            <a href="https://wa.me/77754854274" title="WhatsApp">
              WA
            </a>
          </div>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
