/**
 * Утилита для проверки Chat ID
 * Запустите: node check-chat.js
 */

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env файле');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function checkChat(chatId) {
  try {
    const chat = await bot.getChat(chatId);
    console.log('\n✅ Chat найден!');
    console.log('Информация о чате:');
    console.log(`- Тип: ${chat.type}`);
    console.log(`- ID: ${chat.id}`);
    
    if (chat.title) {
      console.log(`- Название: ${chat.title}`);
    }
    if (chat.first_name) {
      console.log(`- Имя: ${chat.first_name}`);
    }
    if (chat.username) {
      console.log(`- Username: @${chat.username}`);
    }
    
    // Пробуем отправить тестовое сообщение
    console.log('\n📤 Отправка тестового сообщения...');
    await bot.sendMessage(chatId, '✅ Тестовое сообщение от бота. Если вы видите это, все работает!');
    console.log('✅ Тестовое сообщение успешно отправлено!');
    
    return true;
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    
    if (error.response && error.response.body) {
      const telegramError = error.response.body;
      console.error('Детали:', telegramError.description);
      
      if (telegramError.description.includes('chat not found')) {
        console.log('\n💡 Решения:');
        console.log('1. Если это личный чат: начните диалог с ботом');
        console.log('2. Если это группа: добавьте бота в группу как администратора');
        console.log('3. Проверьте правильность Chat ID');
      }
    }
    
    return false;
  }
}

async function getUpdates() {
  try {
    console.log('\n📥 Получение последних обновлений...');
    const updates = await bot.getUpdates();
    
    if (updates.length === 0) {
      console.log('❌ Нет обновлений. Отправьте любое сообщение боту или в группу с ботом.');
      return;
    }
    
    console.log(`\n✅ Найдено ${updates.length} обновлений:\n`);
    
    const chats = new Map();
    updates.forEach((update, index) => {
      if (update.message) {
        const chat = update.message.chat;
        if (!chats.has(chat.id)) {
          chats.set(chat.id, chat);
        }
      }
    });
    
    chats.forEach((chat, chatId) => {
      console.log(`Chat ID: ${chatId}`);
      console.log(`  Тип: ${chat.type}`);
      if (chat.title) console.log(`  Название: ${chat.title}`);
      if (chat.first_name) console.log(`  Имя: ${chat.first_name}`);
      if (chat.username) console.log(`  Username: @${chat.username}`);
      console.log('');
    });
    
    if (chats.size > 0) {
      console.log('💡 Используйте один из этих Chat ID в вашем .env файле');
    }
  } catch (error) {
    console.error('❌ Ошибка при получении обновлений:', error.message);
  }
}

async function main() {
  console.log('🔍 Проверка Telegram Bot конфигурации\n');
  console.log(`Bot Token: ${BOT_TOKEN ? '✅ Установлен' : '❌ Не установлен'}`);
  console.log(`Chat ID: ${CHAT_ID ? `✅ Установлен (${CHAT_ID})` : '❌ Не установлен'}`);
  
  if (!CHAT_ID) {
    console.log('\n📋 Получение доступных чатов...');
    await getUpdates();
    rl.close();
    return;
  }
  
  console.log(`\n🔍 Проверка Chat ID: ${CHAT_ID}...`);
  const isValid = await checkChat(CHAT_ID);
  
  if (isValid) {
    console.log('\n✅ Все настроено правильно! Бот готов к работе.');
  } else {
    console.log('\n❌ Chat ID неверный. Попробуйте получить правильный ID:');
    await getUpdates();
  }
  
  rl.close();
}

main().catch(console.error);

