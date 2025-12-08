/**
 * Обработка команд и интерактивных кнопок Telegram бота
 */

import { getOrders, getOrderById, updateOrderStatus, getOrdersStats } from './database.js';
import { escapeMarkdown } from './index.js';
import { ordersToCSV, getOrdersForExport } from './export.js';

/**
 * Отправляет сообщение в Telegram
 */
async function sendMessage(botToken, chatId, text, options = {}) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const formData = new URLSearchParams();
  formData.append('chat_id', chatId);
  formData.append('text', text);
  formData.append('parse_mode', 'Markdown');
  formData.append('disable_web_page_preview', 'true');
  
  if (options.reply_markup) {
    formData.append('reply_markup', JSON.stringify(options.reply_markup));
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const result = await response.json();
  
  if (!response.ok || !result.ok) {
    throw new Error(result.description || `HTTP ${response.status}`);
  }

  return result;
}

/**
 * Создает клавиатуру с кнопками
 */
function createKeyboard(buttons) {
  return {
    inline_keyboard: buttons.map(row => 
      row.map(btn => ({
        text: btn.text,
        callback_data: btn.callback_data || btn.text
      }))
    )
  };
}

/**
 * Главное меню бота
 */
export function getMainMenu() {
  return createKeyboard([
    [
      { text: '📋 Все заявки', callback_data: 'orders_all' },
      { text: '🆕 Новые', callback_data: 'orders_new' }
    ],
    [
      { text: '📊 Статистика', callback_data: 'stats' },
      { text: '📥 Экспорт', callback_data: 'export_menu' }
    ]
  ]);
}

/**
 * Меню экспорта
 */
export function getExportMenu() {
  return createKeyboard([
    [
      { text: '📥 Все заявки', callback_data: 'export_all' },
      { text: '🆕 Только новые', callback_data: 'export_new' }
    ],
    [
      { text: '⏳ В работе', callback_data: 'export_in_progress' },
      { text: '✅ Выполненные', callback_data: 'export_completed' }
    ],
    [
      { text: '🔙 Главное меню', callback_data: 'main_menu' }
    ]
  ]);
}

/**
 * Кнопки для управления заявкой
 */
export function getOrderActions(orderId) {
  return createKeyboard([
    [
      { text: '✅ В работе', callback_data: `status_${orderId}_in_progress` },
      { text: '✅ Выполнена', callback_data: `status_${orderId}_completed` }
    ],
    [
      { text: '❌ Отменена', callback_data: `status_${orderId}_cancelled` },
      { text: '🔙 Назад', callback_data: 'orders_all' }
    ]
  ]);
}

/**
 * Обработка команды /start
 */
export async function handleStart(botToken, chatId) {
  const message = `👋 *Добро пожаловать в систему управления заявками!*\n\n` +
    `Используйте кнопки ниже для управления заявками.\n\n` +
    `*Доступные команды:*\n` +
    `/orders - Список всех заявок\n` +
    `/stats - Статистика\n` +
    `/export - Выгрузить заявки`;

  await sendMessage(botToken, chatId, message, {
    reply_markup: getMainMenu()
  });
}

/**
 * Обработка команды /orders
 */
export async function handleOrders(botToken, chatId, db, status = null) {
  try {
    if (!db) {
      console.error('БД не доступна в handleOrders');
      await sendMessage(botToken, chatId, 
        `❌ *Ошибка*\n\nБаза данных не настроена. Проверьте конфигурацию Worker.`
      );
      return;
    }

    console.log('Получение заявок, статус:', status);
    const result = await getOrders(db, { status, limit: 10 });
    console.log('Результат getOrders:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Неизвестная ошибка при получении заявок');
    }
    
    if (!result.orders || result.orders.length === 0) {
      await sendMessage(botToken, chatId, 
        `📭 *Заявки не найдены*\n\n` +
        `Нет заявок${status ? ` со статусом "${status}"` : ''}.`,
        { reply_markup: getMainMenu() }
      );
      return;
    }

    let message = `📋 *Список заявок*${status ? ` (${status})` : ''}\n\n`;
    
    result.orders.forEach((order, index) => {
      const date = new Date(order.created_at).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const statusEmoji = {
        'new': '🆕',
        'in_progress': '⏳',
        'completed': '✅',
        'cancelled': '❌'
      };
      
      message += `${index + 1}\\. ${statusEmoji[order.status] || '📄'} *Заявка #${order.id}*\n`;
      message += `👤 ${escapeMarkdown(order.name)}\n`;
      message += `📞 ${escapeMarkdown(order.phone)}\n`;
      message += `📅 ${escapeMarkdown(date)}\n`;
      if (order.products_count > 0) {
        message += `📦 Товаров: ${order.products_count}\n`;
      }
      message += `\n`;
    });

    message += `\n*Используйте кнопки для управления заявками.*`;

    const keyboard = createKeyboard([
      ...result.orders.slice(0, 5).map(order => [
        { text: `#${order.id} - ${order.name}`, callback_data: `order_${order.id}` }
      ]),
      [
        { text: '🔙 Главное меню', callback_data: 'main_menu' }
      ]
    ]);

    await sendMessage(botToken, chatId, message, {
      reply_markup: keyboard
    });
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    let errorMessage = '❌ *Ошибка*\n\nНе удалось получить заявки.';
    
    if (error.message) {
      errorMessage += `\n\n*Детали:* ${error.message}`;
    }
    
    errorMessage += '\n\nПроверьте логи Worker для подробностей.';
    
    await sendMessage(botToken, chatId, errorMessage);
  }
}

/**
 * Обработка просмотра конкретной заявки
 */
export async function handleOrderView(botToken, chatId, db, orderId) {
  try {
    const result = await getOrderById(db, orderId);
    
    if (!result.success) {
      await sendMessage(botToken, chatId, 
        `❌ *Заявка не найдена*\n\nЗаявка #${orderId} не существует.`
      );
      return;
    }

    const order = result.order;
    const date = new Date(order.created_at).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let message = `📄 *Заявка #${order.id}*\n\n`;
    message += `👤 *Клиент:* ${escapeMarkdown(order.name)}\n`;
    message += `📞 *Телефон:* ${escapeMarkdown(order.phone)}\n`;
    
    if (order.email) {
      message += `📧 *Email:* ${escapeMarkdown(order.email)}\n`;
    }
    
    if (order.company) {
      message += `🏢 *Компания:* ${escapeMarkdown(order.company)}\n`;
    }

    const statusText = {
      'new': '🆕 Новая',
      'in_progress': '⏳ В работе',
      'completed': '✅ Выполнена',
      'cancelled': '❌ Отменена'
    };
    message += `\n📊 *Статус:* ${statusText[order.status] || order.status}\n`;

    if (order.products && order.products.length > 0) {
      message += `\n📦 *Товары:*\n`;
      order.products.forEach((product, index) => {
        message += `${index + 1}\\. ${escapeMarkdown(product.product_name)}`;
        if (product.product_price) {
          message += ` - ${escapeMarkdown(product.product_price)}`;
        }
        message += `\n`;
      });
    }

    if (order.comment) {
      message += `\n💬 *Комментарий:*\n${escapeMarkdown(order.comment)}\n`;
    }

    message += `\n📅 *Дата:* ${escapeMarkdown(date)}`;

    await sendMessage(botToken, chatId, message, {
      reply_markup: getOrderActions(orderId)
    });
  } catch (error) {
    console.error('Ошибка при получении заявки:', error);
    await sendMessage(botToken, chatId, 
      '❌ *Ошибка*\n\nНе удалось получить заявку. Попробуйте позже.'
    );
  }
}

/**
 * Обработка изменения статуса заявки
 */
export async function handleStatusChange(botToken, chatId, db, orderId, newStatus) {
  try {
    const result = await updateOrderStatus(db, orderId, newStatus);
    
    if (!result.success) {
      await sendMessage(botToken, chatId, 
        `❌ *Ошибка*\n\n${result.error || 'Не удалось изменить статус заявки.'}`
      );
      return;
    }

    const statusText = {
      'new': '🆕 Новая',
      'in_progress': '⏳ В работе',
      'completed': '✅ Выполнена',
      'cancelled': '❌ Отменена'
    };

    await sendMessage(botToken, chatId, 
      `✅ *Статус обновлен*\n\n` +
      `Заявка #${orderId} теперь имеет статус: ${statusText[newStatus] || newStatus}`,
      { reply_markup: getOrderActions(orderId) }
    );
  } catch (error) {
    console.error('Ошибка при изменении статуса:', error);
    await sendMessage(botToken, chatId, 
      '❌ *Ошибка*\n\nНе удалось изменить статус. Попробуйте позже.'
    );
  }
}

/**
 * Обработка статистики
 */
export async function handleStats(botToken, chatId, db) {
  try {
    if (!db) {
      console.error('БД не доступна в handleStats');
      await sendMessage(botToken, chatId, 
        `❌ *Ошибка*\n\nБаза данных не настроена. Проверьте конфигурацию Worker.`
      );
      return;
    }

    console.log('Получение статистики');
    const result = await getOrdersStats(db);
    console.log('Результат getOrdersStats:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Неизвестная ошибка при получении статистики');
    }

    const stats = result.stats;
    let message = `📊 *Статистика заявок*\n\n`;
    
    message += `📈 *Всего заявок:* ${stats.total}\n`;
    message += `📅 *Сегодня:* ${stats.today}\n\n`;
    
    message += `*По статусам:*\n`;
    stats.byStatus.forEach(stat => {
      const emoji = {
        'new': '🆕',
        'in_progress': '⏳',
        'completed': '✅',
        'cancelled': '❌'
      };
      message += `${emoji[stat.status] || '📄'} ${stat.status}: ${stat.count}\n`;
    });

    await sendMessage(botToken, chatId, message, {
      reply_markup: getMainMenu()
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    let errorMessage = '❌ *Ошибка*\n\nНе удалось получить статистику.';
    
    if (error.message) {
      errorMessage += `\n\n*Детали:* ${error.message}`;
    }
    
    errorMessage += '\n\nПроверьте логи Worker для подробностей.';
    
    await sendMessage(botToken, chatId, errorMessage);
  }
}

/**
 * Обработка callback query (нажатие на кнопку)
 */
export async function handleCallbackQuery(botToken, chatId, db, callbackQuery) {
  // Отвечаем на callback сразу
  const answerUrl = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
  await fetch(answerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      callback_query_id: callbackQuery.id,
      text: 'Обработка...'
    }).toString()
  });

  const data = callbackQuery.data;

  if (data === 'main_menu') {
    await handleStart(botToken, chatId);
  } else if (data === 'orders_all') {
    await handleOrders(botToken, chatId, db);
  } else if (data === 'orders_new') {
    await handleOrders(botToken, chatId, db, 'new');
  } else if (data.startsWith('order_')) {
    const orderId = parseInt(data.split('_')[1]);
    await handleOrderView(botToken, chatId, db, orderId);
  } else if (data.startsWith('status_')) {
    const parts = data.split('_');
    const orderId = parseInt(parts[1]);
    const newStatus = parts[2];
    await handleStatusChange(botToken, chatId, db, orderId, newStatus);
    // Показываем обновленную заявку
    await handleOrderView(botToken, chatId, db, orderId);
  } else if (data === 'stats') {
    await handleStats(botToken, chatId, db);
  } else if (data === 'export_menu') {
    await sendMessage(botToken, chatId, 
      '📥 *Экспорт заявок*\n\nВыберите, какие заявки экспортировать:',
      { reply_markup: getExportMenu() }
    );
  } else if (data.startsWith('export_')) {
    // export_new, export_all, export_completed и т.д.
    const status = data.split('_')[1] === 'all' ? null : data.split('_')[1];
    await handleExport(botToken, chatId, db, status);
  }
}

/**
 * Обработка экспорта заявок
 */
export async function handleExport(botToken, chatId, db, status = null) {
  try {
    if (!db) {
      await sendMessage(botToken, chatId, 
        '❌ *Ошибка*\n\nБаза данных не настроена.'
      );
      return;
    }

    await sendMessage(botToken, chatId, 
      '⏳ *Экспорт заявок*\n\nГенерирую CSV файл...'
    );

    const result = await getOrdersForExport(db, { status });

    if (!result.success) {
      await sendMessage(botToken, chatId, 
        `❌ *Ошибка*\n\n${result.error || 'Не удалось экспортировать заявки.'}`
      );
      return;
    }

    if (!result.orders || result.orders.length === 0) {
      await sendMessage(botToken, chatId, 
        `📭 *Нет данных*\n\nНет заявок${status ? ` со статусом "${status}"` : ''} для экспорта.`,
        { reply_markup: getMainMenu() }
      );
      return;
    }

    const csv = ordersToCSV(result.orders);
    
    // Отправляем файл через Telegram Bot API
    const date = new Date().toISOString().split('T')[0];
    const filename = `orders_${date}${status ? `_${status}` : ''}.csv`;
    
    await sendDocument(botToken, chatId, csv, filename);

    await sendMessage(botToken, chatId, 
      `✅ *Экспорт завершен*\n\n` +
      `Экспортировано заявок: ${result.orders.length}\n` +
      `Файл: ${filename}`,
      { reply_markup: getMainMenu() }
    );
  } catch (error) {
    console.error('Ошибка при экспорте:', error);
    await sendMessage(botToken, chatId, 
      '❌ *Ошибка*\n\nНе удалось экспортировать заявки. Попробуйте позже.'
    );
  }
}

/**
 * Отправляет документ в Telegram
 */
async function sendDocument(botToken, chatId, content, filename) {
  // Конвертируем в base64 для отправки через sendDocument
  const base64Content = btoa(unescape(encodeURIComponent(content)));
  
  // Используем sendDocument с base64 (через input_file)
  // Но Telegram Bot API требует либо file_id, либо URL, либо multipart/form-data
  // Для Workers лучше использовать прямой multipart запрос
  
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const formData = [];
  
  formData.push(`--${boundary}`);
  formData.push(`Content-Disposition: form-data; name="chat_id"`);
  formData.push('');
  formData.push(chatId);
  
  formData.push(`--${boundary}`);
  formData.push(`Content-Disposition: form-data; name="document"; filename="${filename}"`);
  formData.push('Content-Type: text/csv; charset=utf-8');
  formData.push('');
  formData.push(content);
  
  formData.push(`--${boundary}`);
  formData.push(`Content-Disposition: form-data; name="caption"`);
  formData.push('');
  formData.push(`Экспорт заявок - ${filename}`);
  
  formData.push(`--${boundary}--`);
  
  const body = formData.join('\r\n');

  const url = `https://api.telegram.org/bot${botToken}/sendDocument`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: body,
  });

  const result = await response.json();
  
  if (!response.ok || !result.ok) {
    // Если не получилось отправить файл, отправляем ссылку на API
    const apiUrl = `https://kpftse-telegram-api.300amiri.workers.dev/api/export`;
    await sendMessage(botToken, chatId, 
      `📥 *Экспорт заявок*\n\n` +
      `Не удалось отправить файл через бота.\n` +
      `Скачайте через API:\n${apiUrl}`
    );
    throw new Error(result.description || `HTTP ${response.status}`);
  }

  return result;
}

