/**
 * Функции для экспорта заявок в CSV/Excel
 */

import { getOrders } from './database.js';

/**
 * Конвертирует заявки в CSV формат
 */
export function ordersToCSV(orders) {
  if (!orders || orders.length === 0) {
    return 'Нет данных для экспорта';
  }

  // Заголовки CSV
  const headers = [
    'ID',
    'Имя',
    'Телефон',
    'Email',
    'Компания',
    'Статус',
    'Товары',
    'Комментарий',
    'Дата создания'
  ];

  // Кодировка для Excel (BOM для UTF-8)
  let csv = '\uFEFF';
  csv += headers.join(',') + '\n';

  // Данные
  orders.forEach(order => {
    const row = [
      order.id || '',
      escapeCSV(order.name || ''),
      escapeCSV(order.phone || ''),
      escapeCSV(order.email || ''),
      escapeCSV(order.company || ''),
      order.status || '',
      formatProducts(order.products || []),
      escapeCSV(order.comment || ''),
      formatDate(order.created_at)
    ];
    csv += row.join(',') + '\n';
  });

  return csv;
}

/**
 * Экранирует значения для CSV
 */
function escapeCSV(value) {
  if (!value) return '';
  
  const str = String(value);
  
  // Если содержит запятую, кавычки или перенос строки, оборачиваем в кавычки
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Форматирует товары для CSV
 */
function formatProducts(products) {
  if (!products || products.length === 0) {
    return 'Нет товаров';
  }
  
  return products.map(p => 
    `${p.product_name || ''}${p.product_price ? ` (${p.product_price})` : ''}`
  ).join('; ');
}

/**
 * Форматирует дату для CSV
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Получает заявки для экспорта с фильтрацией
 */
export async function getOrdersForExport(db, options = {}) {
  const {
    status = null,
    startDate = null,
    endDate = null,
    limit = 10000 // Большой лимит для экспорта
  } = options;

  try {
    // Получаем все заявки (или с фильтром)
    const result = await getOrders(db, { status, limit, offset: 0 });
    
    if (!result.success || !result.orders) {
      return { success: false, error: result.error || 'Ошибка при получении заявок' };
    }

    let orders = result.orders;

    // Фильтрация по датам, если указаны
    if (startDate || endDate) {
      orders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        
        if (startDate && orderDate < new Date(startDate)) {
          return false;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // До конца дня
          if (orderDate > end) {
            return false;
          }
        }
        
        return true;
      });
    }

    return {
      success: true,
      orders
    };
  } catch (error) {
    console.error('Ошибка при получении заявок для экспорта:', error);
    return {
      success: false,
      error: error.message || 'Ошибка при получении заявок'
    };
  }
}

