import React from "react";
import styles from "./Partners.module.css";

const Partners: React.FC = () => {
  const partners = [
    "https://optim.tildacdn.pro/tild3934-6536-4237-b031-336630343464/-/resize/192x/-/format/webp/photo.jpg.webp",
    "https://optim.tildacdn.pro/tild6239-6530-4937-a162-653034613964/-/resize/192x/-/format/webp/noroot.png.webp",
    "https://optim.tildacdn.pro/tild6534-6363-4265-b865-643533666263/-/resize/192x/-/format/webp/_.png.webp",
    "https://optim.tildacdn.pro/tild3330-3234-4534-b137-666164636261/-/resize/192x/-/format/webp/photo.png.webp",
    "https://optim.tildacdn.pro/tild6263-6433-4564-b937-636336326435/-/resize/192x/-/format/webp/photo.png.webp",
    "https://optim.tildacdn.pro/tild6236-3337-4165-a333-626431346437/-/resize/192x/-/format/webp/logo_transparent_m.png.webp",
  ];

  return (
    <section className={styles.partners}>
      <div className={styles.container}>
        <h2 className={styles.title}>Наши партнеры</h2>
        <div className={styles.grid}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.partnerCard}>
              <img src={partner} alt={`Партнер ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>Станьте нашим партнером</h3>
          <div className={styles.videoContainer}>
            <iframe
              src="https://www.youtube.com/embed/adeeAOIUf7M"
              title="ТОО Техснабэлеaктрикс"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
