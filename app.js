const express = require('express');
const { Telegraf } = require('telegraf');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9256;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public_html'));

const WEB_APP_URL = 'https://dino.bothost.ru';
const WELCOME_IMAGE_URL = 'https://radika1.link/2026/02/11/if9e2a3d45127c3e6.jpeg';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  try {
    await ctx.replyWithPhoto(
      { url: WELCOME_IMAGE_URL },
      {
        caption: '🦖 *Добро пожаловать в Dino Chrome Game!*\n\n' +
                'Запусти легендарную игру Dino Chrome прямо в Telegram! 🎮\n\n' +
                '🎯 *Особенности:*\n' +
                '• Высокая скорость игры\n' +
                '• Улучшай свои рекорды\n' +
                '• Весело проводи время!\n\n' +
                '_Нажми кнопку "🎮 Играть", чтобы начать!_',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: '🎮 Играть', 
                web_app: { url: WEB_APP_URL } 
              }
            ],
            [
              { 
                text: '🎁 Бесплатный хостинг', 
                url: 'https://bothost.ru/' 
              },
              { 
                text: '📢 Наш канал', 
                url: 'https://t.me/bothostru' 
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Ошибка при отправке приветствия:', error);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
});

bot.command('game', async (ctx) => {
  await ctx.reply(
    '🎮 *Запусти игру Dino Chrome!*\n\nНажми на кнопку ниже, чтобы открыть игру:',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: '🦖 Играть в Dino Chrome', 
              web_app: { url: WEB_APP_URL } 
            }
          ],
          [
            { text: '👈 Назад', callback_data: 'back_to_menu' }
          ]
        ]
      }
    }
  );
});

bot.action('back_to_menu', async (ctx) => {
  try {
    await ctx.deleteMessage();
    await ctx.answerCbQuery();
    await ctx.replyWithPhoto(
      { url: WELCOME_IMAGE_URL },
      {
        caption: '🦖 *Добро пожаловать в Dino Chrome Game!*\n\n' +
                'Запусти легендарную игру Dino Chrome прямо в Telegram! 🎮',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: '🎮 Играть', 
                web_app: { url: WEB_APP_URL } 
              }
            ],
            [
              { 
                text: '🎁 Бесплатный хостинг', 
                url: 'https://bothost.ru/' 
              },
              { 
                text: '📢 Наш канал', 
                url: 'https://t.me/bothostru' 
              }
            ]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Ошибка:', error);
  }
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  if (text.includes('игра') || text.includes('dino') || text.includes('🦖')) {
    await ctx.reply(
      'Чтобы сыграть в Dino Chrome, нажмите кнопку ниже 👇',
      {
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: '🦖 Запустить игру', 
                web_app: { url: WEB_APP_URL } 
              }
            ]
          ]
        }
      }
    );
  } else {
    await ctx.reply(
      '🦖 Привет! Я бот для игры в Dino Chrome.\n\n' +
      'Используй команды:\n' +
      '/start - Главное меню\n' +
      '/game - Запустить игру',
      {
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: '🎮 Играть', 
                web_app: { url: WEB_APP_URL } 
              }
            ]
          ]
        }
      }
    );
  }
});

app.get('/bot', (req, res) => {
  res.json({
    name: 'Dino Game Bot',
    version: '1.0.0',
    web_app_url: WEB_APP_URL,
    port: PORT
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'dino-game-bot'
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dino Game Bot работает! 🦖',
    endpoints: {
      game: WEB_APP_URL,
      bot_info: '/bot',
      health: '/health',
      status: '/status'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`📁 Статика раздаётся из папки: ${path.resolve('public_html')}`);
  console.log(`🌐 Mini App доступно: ${WEB_APP_URL}`);
  console.log(`🤖 Бот готов к работе!`);
});

bot.launch()
  .then(() => console.log('✅ Бот Telegram запущен'))
  .catch((error) => console.error('❌ Ошибка запуска бота:', error));

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  console.log('👋 Бот остановлен');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  console.log('👋 Бот остановлен');
});