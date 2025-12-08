import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    phone: "+7",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время.',
        });
        // Очистка формы
        setFormData({
          phone: '+7',
          message: '',
        });
      } else {
        throw new Error(result.error || 'Ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="contact" className={styles.contact}>
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
              {submitStatus.type && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    backgroundColor:
                      submitStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: submitStatus.type === 'success' ? '#065f46' : '#991b1b',
                    fontSize: '14px',
                  }}
                >
                  {submitStatus.message}
                </div>
              )}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
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
