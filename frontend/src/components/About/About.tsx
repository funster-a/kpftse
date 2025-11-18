import React from "react";
import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      {/* Герой секция */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>О КОМПАНИИ</h1>
            <p className={styles.heroSubtitle}>
              ТОО «Техснабэлектрикс» - надежный партнер в сфере поставок
              электротехнического оборудования
            </p>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>НАША ИСТОРИЯ</h2>
              <div className={styles.textBlock}>
                <p>
                  ТОО «Техснабэлектрикс» было основано с целью обеспечения
                  промышленных предприятий Казахстана высококачественным
                  электротехническим оборудованием и надежными решениями в
                  области энергетики.
                </p>
                <p>
                  За годы работы мы зарекомендовали себя как ответственный
                  поставщик, предлагающий комплексные решения для различных
                  отраслей промышленности, включая нефтегазовый сектор,
                  энергетику, металлургию и машиностроение.
                </p>
              </div>

              <h2 className={styles.sectionTitle}>НАША МИССИЯ</h2>
              <div className={styles.textBlock}>
                <p>
                  Обеспечивать промышленные предприятия современным, надежным и
                  энергоэффективным электрооборудованием, способствуя развитию
                  промышленного потенциала Казахстана.
                </p>
              </div>

              <h2 className={styles.sectionTitle}>
                ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ
              </h2>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>⚡</div>
                  <div className={styles.featureContent}>
                    <h3>Поставки электрооборудования</h3>
                    <p>
                      Комплексные поставки электротехнической продукции от
                      ведущих мировых производителей
                    </p>
                  </div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🔧</div>
                  <div className={styles.featureContent}>
                    <h3>Техническое обслуживание</h3>
                    <p>
                      Профессиональный ремонт и сервисное обслуживание
                      электрооборудования
                    </p>
                  </div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>📊</div>
                  <div className={styles.featureContent}>
                    <h3>Технические решения</h3>
                    <p>
                      Разработка индивидуальных решений для конкретных
                      производственных задач
                    </p>
                  </div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🚚</div>
                  <div className={styles.featureContent}>
                    <h3>Логистика</h3>
                    <p>Организация доставки оборудования по всему Казахстану</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3>КОНТАКТНАЯ ИНФОРМАЦИЯ</h3>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <strong>Адрес:</strong>
                    <span>г. Нур-Султан, ул. Примерная, 123</span>
                  </div>
                  <div className={styles.contactItem}>
                    <strong>Телефон:</strong>
                    <span>+7 (727) 360-71-60</span>
                  </div>
                  <div className={styles.contactItem}>
                    <strong>Email:</strong>
                    <span>info@techsnab.kz</span>
                  </div>
                  <div className={styles.contactItem}>
                    <strong>Режим работы:</strong>
                    <span>Пн-Пт: 9:00-18:00</span>
                  </div>
                </div>
              </div>

              <div className={styles.statsCard}>
                <h3>МЫ В ЦИФРАХ</h3>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>10+</div>
                    <div className={styles.statLabel}>лет на рынке</div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>500+</div>
                    <div className={styles.statLabel}>
                      реализованных проектов
                    </div>
                  </div>
                  <div className={styles.stat}>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>постоянных клиентов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция ценностей */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={styles.valuesTitle}>НАШИ ЦЕННОСТИ</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>КАЧЕСТВО</h3>
              <p>
                Мы работаем только с проверенными производителями и поставляем
                оборудование, соответствующее международным стандартам
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>НАДЕЖНОСТЬ</h3>
              <p>
                Гарантируем выполнение обязательств и обеспечиваем техническую
                поддержку на всех этапах сотрудничества
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>ПРОФЕССИОНАЛИЗМ</h3>
              <p>
                Наша команда состоит из опытных специалистов, готовых предложить
                оптимальные технические решения
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>ПАРТНЕРСТВО</h3>
              <p>
                Строим долгосрочные отношения с клиентами, основанные на
                взаимном доверии и понимании потребностей
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
