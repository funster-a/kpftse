import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendOrderToTelegram } from './telegram.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API endpoint для заявок из каталога
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Валидация данных
    if (!orderData.name || !orderData.phone) {
      return res.status(400).json({ 
        error: 'Имя и телефон обязательны для заполнения' 
      });
    }

    // Отправка в Telegram
    const telegramResult = await sendOrderToTelegram(orderData);
    
    if (telegramResult.success) {
      res.json({ 
        success: true, 
        message: 'Заявка успешно отправлена менеджеру' 
      });
    } else {
      throw new Error(telegramResult.error);
    }
  } catch (error) {
    console.error('Ошибка при обработке заявки:', error);
    res.status(500).json({ 
      error: 'Произошла ошибка при отправке заявки. Попробуйте позже.' 
    });
  }
});

// API endpoint для простых заявок из формы контактов
app.post('/api/contact', async (req, res) => {
  try {
    const contactData = req.body;
    
    // Валидация
    if (!contactData.phone) {
      return res.status(400).json({ 
        error: 'Телефон обязателен для заполнения' 
      });
    }

    // Формируем данные заявки
    const orderData = {
      name: contactData.name || 'Не указано',
      phone: contactData.phone,
      email: contactData.email || 'Не указано',
      company: contactData.company || 'Не указано',
      comment: contactData.message || contactData.comment || 'Нет комментария',
      products: []
    };

    // Отправка в Telegram
    const telegramResult = await sendOrderToTelegram(orderData);
    
    if (telegramResult.success) {
      res.json({ 
        success: true, 
        message: 'Заявка успешно отправлена менеджеру' 
      });
    } else {
      throw new Error(telegramResult.error);
    }
  } catch (error) {
    console.error('Ошибка при обработке заявки:', error);
    res.status(500).json({ 
      error: 'Произошла ошибка при отправке заявки. Попробуйте позже.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 Telegram bot is ${process.env.TELEGRAM_BOT_TOKEN ? 'configured' : 'NOT configured'}`);
});

