/**
 * Cloudflare Worker для отправки заявок в Telegram
 */

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
    minute: '2-digit',
    timeZone: 'Asia/Almaty'
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
 * Отправляет сообщение в Telegram через Bot API
 */
async function sendToTelegram(message, botToken, chatId) {
  // Очистка токена и chat_id от пробелов и лишних символов
  const cleanToken = String(botToken).trim();
  const cleanChatId = String(chatId).trim();
  
  // Валидация
  if (!cleanToken || cleanToken.length < 10) {
    throw new Error('Invalid bot token: token is too short or empty');
  }
  
  if (!cleanChatId || cleanChatId.length === 0) {
    throw new Error('Invalid chat ID: chat ID is empty');
  }
  
  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
  
  console.log('Telegram API request:', {
    url: url.replace(cleanToken, 'BOT_TOKEN_HIDDEN'),
    chatId: cleanChatId,
    messageLength: message.length,
    tokenLength: cleanToken.length,
    tokenPrefix: cleanToken.substring(0, 10) + '...'
  });
  
  const formData = new URLSearchParams();
  formData.append('chat_id', cleanChatId);
  formData.append('text', message);
  formData.append('parse_mode', 'Markdown');
  formData.append('disable_web_page_preview', 'true');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();
    
    console.log('Telegram API response:', {
      status: response.status,
      ok: result.ok,
      errorCode: result.error_code,
      description: result.description
    });
    
    if (!response.ok) {
      const errorMsg = result.description || `HTTP ${response.status}`;
      console.error('Telegram API error:', {
        status: response.status,
        statusText: response.statusText,
        error: result,
        url: url.replace(cleanToken, 'BOT_TOKEN_HIDDEN')
      });
      
      // Специальная обработка для 404
      if (response.status === 404) {
        if (result.description === 'Not Found') {
          throw new Error('Chat not found or bot token invalid. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID');
        }
      }
      
      throw new Error(errorMsg);
    }
    
    if (!result.ok) {
      const errorMsg = result.description || 'Unknown Telegram API error';
      console.error('Telegram API returned error:', result);
      
      // Специальная обработка для разных ошибок
      if (result.error_code === 400) {
        if (result.description && result.description.includes('chat not found')) {
          throw new Error('Chat not found. Make sure bot is added to group or you started a conversation with the bot.');
        }
      }
      
      throw new Error(errorMsg);
    }

    return result;
  } catch (error) {
    // Если это уже наша ошибка, пробрасываем дальше
    if (error.message && !error.message.includes('HTTP')) {
      throw error;
    }
    
    // Иначе оборачиваем в понятное сообщение
    console.error('Error sending to Telegram:', error);
    throw new Error(`Failed to send message to Telegram: ${error.message}`);
  }
}

/**
 * Обработчик CORS
 */
function handleCORS(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://kpftse-telegram-api.300amiri.workers.dev',
  ];

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  // Разрешаем все origins для разработки, или проверяем список
  if (origin) {
    // Разрешаем localhost для разработки
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      headers.set('Access-Control-Allow-Origin', origin);
    }
    // Разрешаем Cloudflare Pages домены
    else if (origin.endsWith('.pages.dev') || origin.endsWith('.workers.dev')) {
      headers.set('Access-Control-Allow-Origin', origin);
    }
    // Проверяем список разрешенных
    else if (allowedOrigins.some(allowed => origin.includes(allowed))) {
      headers.set('Access-Control-Allow-Origin', origin);
    }
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('Access-Control-Allow-Credentials', 'false');

  return headers;
}

/**
 * Основной обработчик запросов
 */
export default {
  async fetch(request, env) {
    // Обработка CORS preflight
    if (request.method === 'OPTIONS') {
      const headers = handleCORS(request);
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Cloudflare Worker is running' 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Проверка наличия токена и chat ID
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return new Response(JSON.stringify({ 
        error: 'Telegram bot не настроен. Проверьте переменные окружения.' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...handleCORS(request)
        },
      });
    }

    // Обработка заявок из каталога
    if (path === '/api/orders' && request.method === 'POST') {
      try {
        const orderData = await request.json();

        // Валидация
        if (!orderData.name || !orderData.phone) {
          return new Response(JSON.stringify({ 
            error: 'Имя и телефон обязательны для заполнения' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...handleCORS(request)
            },
          });
        }

        // Форматирование и отправка
        const message = formatOrderMessage(orderData);
        console.log('Sending order to Telegram:', {
          hasToken: !!env.TELEGRAM_BOT_TOKEN,
          hasChatId: !!env.TELEGRAM_CHAT_ID,
          chatId: env.TELEGRAM_CHAT_ID,
          messageLength: message.length
        });
        await sendToTelegram(message, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Заявка успешно отправлена менеджеру' 
        }), {
          status: 200,
          headers: handleCORS(request),
        });
      } catch (error) {
        console.error('Ошибка при обработке заявки:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        let errorMessage = 'Произошла ошибка при отправке заявки. Попробуйте позже.';
        let statusCode = 500;
        
        if (error.message) {
          if (error.message.includes('chat not found') || error.message.includes('Chat not found')) {
            errorMessage = 'Chat не найден. Проверьте TELEGRAM_CHAT_ID в настройках. Убедитесь, что бот добавлен в группу или вы начали диалог с ботом.';
            statusCode = 400;
          } else if (error.message.includes('Unauthorized') || error.message.includes('Unauthorized')) {
            errorMessage = 'Неверный токен бота. Проверьте TELEGRAM_BOT_TOKEN в настройках.';
            statusCode = 401;
          } else if (error.message.includes('Not Found')) {
            errorMessage = 'Telegram API вернул ошибку "Not Found". Проверьте правильность токена бота и Chat ID.';
            statusCode = 404;
          } else if (error.message.includes('parse entities') || error.message.includes('parse')) {
            errorMessage = 'Ошибка форматирования сообщения. Попробуйте еще раз.';
            statusCode = 400;
          } else {
            errorMessage = `Ошибка: ${error.message}`;
          }
        }

        return new Response(JSON.stringify({ 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }), {
          status: statusCode,
          headers: handleCORS(request),
        });
      }
    }

     // Обработка простых заявок из формы контактов
     if (path === '/api/contact' && request.method === 'POST') {
       try {
         let contactData;
         try {
           contactData = await request.json();
         } catch (parseError) {
           console.error('Ошибка парсинга JSON:', parseError);
           return new Response(JSON.stringify({ 
             error: 'Неверный формат данных. Ожидается JSON.' 
           }), {
             status: 400,
             headers: { 
               'Content-Type': 'application/json',
               ...handleCORS(request)
             },
           });
         }

        // Валидация
        if (!contactData.phone) {
          return new Response(JSON.stringify({ 
            error: 'Телефон обязателен для заполнения' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...handleCORS(request)
            },
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

         // Форматирование и отправка
         const message = formatOrderMessage(orderData);
         console.log('Sending contact to Telegram:', {
           hasToken: !!env.TELEGRAM_BOT_TOKEN,
           hasChatId: !!env.TELEGRAM_CHAT_ID,
           chatId: env.TELEGRAM_CHAT_ID,
           messageLength: message.length
         });
         await sendToTelegram(message, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);

         return new Response(JSON.stringify({ 
           success: true, 
           message: 'Заявка успешно отправлена менеджеру' 
         }), {
           status: 200,
           headers: handleCORS(request),
         });
       } catch (error) {
         console.error('Ошибка при обработке заявки:', error);
         console.error('Error details:', {
           message: error.message,
           stack: error.stack,
           name: error.name
         });
         
         let errorMessage = 'Произошла ошибка при отправке заявки. Попробуйте позже.';
         let statusCode = 500;
         
         if (error.message) {
           if (error.message.includes('chat not found') || error.message.includes('Chat not found')) {
             errorMessage = 'Chat не найден. Проверьте TELEGRAM_CHAT_ID в настройках. Убедитесь, что бот добавлен в группу или вы начали диалог с ботом.';
             statusCode = 400;
           } else if (error.message.includes('Unauthorized') || error.message.includes('Unauthorized')) {
             errorMessage = 'Неверный токен бота. Проверьте TELEGRAM_BOT_TOKEN в настройках.';
             statusCode = 401;
           } else if (error.message.includes('Not Found')) {
             errorMessage = 'Telegram API вернул ошибку "Not Found". Проверьте правильность токена бота и Chat ID.';
             statusCode = 404;
           } else if (error.message.includes('parse entities') || error.message.includes('parse')) {
             errorMessage = 'Ошибка форматирования сообщения. Попробуйте еще раз.';
             statusCode = 400;
           } else {
             errorMessage = `Ошибка: ${error.message}`;
           }
         }

         return new Response(JSON.stringify({ 
           error: errorMessage,
           details: process.env.NODE_ENV === 'development' ? error.message : undefined
         }), {
           status: statusCode,
           headers: handleCORS(request),
         });
       }
     }

     // 404 для неизвестных путей
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        ...handleCORS(request)
      },
    });
  },
};

