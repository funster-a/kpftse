import React from "react";
import styles from "./Advantages.module.css";

const Advantages: React.FC = () => {
  const advantages = [
    {
      icon: "https://optim.tildacdn.pro/tild3834-3035-4436-b262-616538396530/-/resize/121x/-/format/webp/icons8----100.png.webp",
      title: "Гарантия качества",
      description:
        "Вся продукция обязательно проходит строгий контроль и соответствует заявленным характеристикам",
    },
    {
      icon: "https://optim.tildacdn.pro/tild6532-6235-4464-a339-613735346232/-/resize/120x/-/format/webp/icons8-----96.png.webp",
      title: "Реальные сроки изготовления",
      description:
        "Наши производственные мощности позволяют выполнять заказы в самые короткие сроки",
    },
    {
      icon: "https://optim.tildacdn.pro/tild3235-3632-4464-b230-653633663638/-/resize/120x/-/format/webp/icons8--80.png.webp",
      title: "Большой ассортимент продукции",
      description:
        "Мы производим широкий ассортимент задвижек рабочим давлением от 0,16 МПа до 25 МПа условным диаметром от 15мм до 1400мм",
    },
  ];

  return (
    <section className={styles.advantages}>
      <div className={styles.container}>
        <h2 className={styles.title}>НАШИ ПРЕИМУЩЕСТВА</h2>
        <div className={styles.grid}>
          {advantages.map((advantage, index) => (
            <div key={index} className={styles.advantageCard}>
              <div className={styles.iconContainer}>
                <img src={advantage.icon} alt={advantage.title} />
              </div>
              <h3 className={styles.advantageTitle}>{advantage.title}</h3>
              <p className={styles.advantageDescription}>
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
