import React from "react";
import styles from "./Services.module.css";

const Services: React.FC = () => {
  const services = [
    {
      title: "Услуги мехобработки",
      description:
        "Наша компания имеет технические возможности для предоставления токарных (L до 4000мм), фрезерных (до Ø1200мм), расточных и сварочных работ.",
    },
    {
      title: "ОТЕЧЕСТВЕННЫЙ ТОВАРОПРОИЗВОДИТЕЛЬ",
      description:
        "Наше товарищество является отечественным товаропроизводителем и квалифицированным поставщиком АО ФНБ «Самрук-Казына».",
    },
    {
      title: "ОПЫТ + ИННОВАЦИЯ",
      description:
        "У нас традиционный опыт производства запорной, регулирующей и трубопроводной арматуры сочетается с современными и инновационными методами производства.",
    },
    {
      title: "Ремонт запорной арматуры",
      description:
        "Наша компания осуществляет качественные услуги по ремонту запорной арматуры, с гарантией на все отремонтированные изделия",
    },
    {
      title: "ШИРОКИЙ АССОРТИМЕНТ",
      description:
        "Наша компания всегда предлагает своим покупателям широкий, постоянно обновляемый ассортимент для нефтегазовой отрасли, химического машиностроения, энергетики и металлургии и т.д. Вся продукция отвечает стандартам и техническим условиям.",
    },
  ];

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <a href="#form" className={styles.serviceLink}>
                Получить консультацию
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
