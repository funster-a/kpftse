/**
 * Функции для работы с базой данных D1
 */

/**
 * Сохраняет заявку в базу данных
 */
export async function saveOrder(db, orderData) {
  try {
    // Вставляем заявку
    const orderResult = await db.prepare(
      `INSERT INTO orders (name, phone, email, company, comment, status)
       VALUES (?, ?, ?, ?, ?, 'new')
       RETURNING id, created_at`
    )
    .bind(
      orderData.name || 'Не указано',
      orderData.phone,
      orderData.email || null,
      orderData.company || null,
      orderData.comment || null
    )
    .first();

    const orderId = orderResult.id;

    // Сохраняем товары, если они есть
    if (orderData.products && orderData.products.length > 0) {
      const insertProduct = db.prepare(
        `INSERT INTO order_products (order_id, product_id, product_name, product_price)
         VALUES (?, ?, ?, ?)`
      );

      const statements = orderData.products.map(product =>
        insertProduct.bind(
          orderId,
          product.id || null,
          product.name,
          product.price || null
        )
      );

      await db.batch(statements);
    }

    return {
      success: true,
      orderId,
      createdAt: orderResult.created_at
    };
  } catch (error) {
    console.error('Ошибка при сохранении заявки в БД:', error);
    throw error;
  }
}

/**
 * Получает все заявки с фильтрацией
 */
export async function getOrders(db, options = {}) {
  try {
    if (!db) {
      return { success: false, error: 'База данных не доступна' };
    }

    const { status, limit = 50, offset = 0 } = options;
    
    let query = `
      SELECT 
        o.*,
        COUNT(op.id) as products_count
      FROM orders o
      LEFT JOIN order_products op ON o.id = op.order_id
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    
    query += `
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limit, offset);

    console.log('Выполнение запроса getOrders:', { query, params });
    const result = await db.prepare(query).bind(...params).all();
    console.log('Результат запроса:', result);
    
    // Получаем товары для каждой заявки
    const orders = await Promise.all(
      result.results.map(async (order) => {
        const products = await db.prepare(
          'SELECT * FROM order_products WHERE order_id = ?'
        )
        .bind(order.id)
        .all();
        
        return {
          ...order,
          products: products.results || []
        };
      })
    );

    return {
      success: true,
      orders,
      total: result.results.length
    };
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      success: false,
      error: error.message || 'Ошибка при получении заявок из БД'
    };
  }
}

/**
 * Получает заявку по ID
 */
export async function getOrderById(db, orderId) {
  try {
    const order = await db.prepare(
      'SELECT * FROM orders WHERE id = ?'
    )
    .bind(orderId)
    .first();

    if (!order) {
      return { success: false, error: 'Заявка не найдена' };
    }

    const products = await db.prepare(
      'SELECT * FROM order_products WHERE order_id = ?'
    )
    .bind(orderId)
    .all();

    return {
      success: true,
      order: {
        ...order,
        products: products.results || []
      }
    };
  } catch (error) {
    console.error('Ошибка при получении заявки:', error);
    throw error;
  }
}

/**
 * Обновляет статус заявки
 */
export async function updateOrderStatus(db, orderId, status) {
  try {
    const validStatuses = ['new', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Неверный статус' };
    }

    const result = await db.prepare(
      `UPDATE orders 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    )
    .bind(status, orderId)
    .run();

    if (result.success && result.meta.changes > 0) {
      return { success: true };
    } else {
      return { success: false, error: 'Заявка не найдена' };
    }
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    throw error;
  }
}

/**
 * Получает статистику по заявкам
 */
export async function getOrdersStats(db) {
  try {
    if (!db) {
      return { success: false, error: 'База данных не доступна' };
    }

    console.log('Получение статистики из БД');
    
    const stats = await db.prepare(
      `SELECT 
        status,
        COUNT(*) as count
       FROM orders
       GROUP BY status`
    ).all();
    console.log('Статистика по статусам:', stats);

    const total = await db.prepare(
      'SELECT COUNT(*) as total FROM orders'
    ).first();
    console.log('Всего заявок:', total);

    const today = await db.prepare(
      `SELECT COUNT(*) as count 
       FROM orders 
       WHERE DATE(created_at) = DATE('now')`
    ).first();
    console.log('Заявок сегодня:', today);

    return {
      success: true,
      stats: {
        byStatus: stats.results || [],
        total: total.total || 0,
        today: today.count || 0
      }
    };
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      success: false,
      error: error.message || 'Ошибка при получении статистики из БД'
    };
  }
}

