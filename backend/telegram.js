import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('⚠️  Telegram bot token or chat ID not configured!');
}

// Создаем экземпляр бота
const bot = BOT_TOKEN ? new TelegramBot(BOT_TOKEN, { polling: false }) : null;

/**
 * Экранирует специальные символы Markdown для Telegram
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

/**
 * Форматирует данные заявки в красивое сообщение для Telegram
 */
function formatOrderMessage(orderData) {
  const date = new Date().toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `🆕 *Новая заявка*\n\n`;
  
  // Информация о клиенте (экранируем все пользовательские данные)
  message += `👤 *Клиент:* ${escapeMarkdown(orderData.name || 'Не указано')}\n`;
  message += `📞 *Телефон:* ${escapeMarkdown(orderData.phone)}\n`;
  
  if (orderData.email && orderData.email !== 'Не указано') {
    message += `📧 *Email:* ${escapeMarkdown(orderData.email)}\n`;
  }
  
  if (orderData.company && orderData.company !== 'Не указано') {
    message += `🏢 *Компания:* ${escapeMarkdown(orderData.company)}\n`;
  }
  
  // Товары
  if (orderData.products && orderData.products.length > 0) {
    message += `\n📦 *Товары:*\n`;
    orderData.products.forEach((product, index) => {
      message += `${index + 1}\\. ${escapeMarkdown(product.name)}`;
      if (product.price) {
        message += ` - ${escapeMarkdown(product.price)}`;
      }
      message += `\n`;
    });
    message += `\n*Всего товаров:* ${orderData.products.length}\n`;
  } else {
    message += `\n📝 *Тип заявки:* Общая консультация\n`;
  }
  
  // Комментарий
  if (orderData.comment && orderData.comment !== 'Нет комментария') {
    message += `\n💬 *Комментарий:*\n${escapeMarkdown(orderData.comment)}\n`;
  }
  
  message += `\n⏰ *Дата:* ${escapeMarkdown(date)}`;
  
  return message;
}

/**
 * Проверяет, может ли бот отправить сообщение в указанный чат
 */
async function validateChat() {
  try {
    await bot.getChat(CHAT_ID);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message || 'Не удалось проверить чат' 
    };
  }
}

/**
 * Отправляет заявку в Telegram
 */
export async function sendOrderToTelegram(orderData) {
  if (!bot || !BOT_TOKEN || !CHAT_ID) {
    return {
      success: false,
      error: 'Telegram bot не настроен. Проверьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID'
    };
  }

  try {
    // Проверяем валидность Chat ID
    const chatValidation = await validateChat();
    if (!chatValidation.valid) {
      let errorMessage = 'Chat ID неверный или недоступен. ';
      
      if (chatValidation.error.includes('chat not found')) {
        errorMessage += '\n\nВозможные причины:\n';
        errorMessage += '1. Chat ID указан неправильно\n';
        errorMessage += '2. Если это личный чат - начните диалог с ботом (@your_bot_name)\n';
        errorMessage += '3. Если это группа - добавьте бота в группу как администратора\n';
        errorMessage += '\nКак получить правильный Chat ID:\n';
        errorMessage += '- Для личного чата: начните диалог с @userinfobot\n';
        errorMessage += '- Для группы: добавьте бота в группу, отправьте сообщение, затем используйте:\n';
        errorMessage += '  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }

    const message = formatOrderMessage(orderData);
    
    await bot.sendMessage(CHAT_ID, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    return {
      success: true,
      message: 'Заявка успешно отправлена в Telegram'
    };
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    
    let errorMessage = error.message || 'Неизвестная ошибка при отправке в Telegram';
    
    // Более понятные сообщения об ошибках
    if (error.response && error.response.body) {
      const telegramError = error.response.body;
      
      if (telegramError.description) {
        if (telegramError.description.includes('chat not found')) {
          errorMessage = 'Chat не найден. Убедитесь, что:\n';
          errorMessage += '1. Chat ID правильный\n';
          errorMessage += '2. Бот добавлен в группу (если это группа)\n';
          errorMessage += '3. Вы начали диалог с ботом (если это личный чат)';
        } else if (telegramError.description.includes('bot was blocked')) {
          errorMessage = 'Бот заблокирован пользователем. Разблокируйте бота в Telegram.';
        } else if (telegramError.description.includes('parse entities')) {
          errorMessage = 'Ошибка форматирования сообщения. Попробуйте еще раз.';
        } else {
          errorMessage = `Telegram API ошибка: ${telegramError.description}`;
        }
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

