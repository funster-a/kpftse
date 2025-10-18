import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    phone: "+7",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="form" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.formSection}>
            <h2 className={styles.title}>
              Оставьте заявку и наш менеджер свяжется с вами
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="+7"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Ваше сообщение"
                rows={4}
              />
              <button type="submit" className={styles.submitButton}>
                Отправить
              </button>
            </form>
          </div>

          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>
              Напишите нам и наш менеджер свяжется с вами
            </h3>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <strong>Телефоны:</strong>
                <p>+7 (700) 000-71-11</p>
                <p>+7 (775) 485-42-74</p>
                <p>+7 (701) 759 6495</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Email:</strong>
                <p>infotse@kpf.kz</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Адрес:</strong>
                <p>г. Алматы, Алатауский район, ул. Барыс, 4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
