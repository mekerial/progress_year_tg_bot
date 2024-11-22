const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv')
dotenv.config()


const tgBotToken = process.env.TG_BOT_TOKEN
const bot = new TelegramBot(tgBotToken, { polling: true });


const CHANNEL_ID = process.env.TG_CHANNEL_ID;


function getYearCompletionPercentage() {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
    const now = new Date();

    const totalMilliseconds = endOfYear - startOfYear;
    const elapsedMilliseconds = now - startOfYear;

    return Math.floor((elapsedMilliseconds / totalMilliseconds) * 100);
}


function generateProgressBar(percentage) {
    const totalBlocks = 20; // Количество блоков в прогресс-баре
    const filledBlocks = Math.floor((percentage / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    const progressBar = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    return `${progressBar}  ${percentage}%`;
}


let lastPercentage = null;


function checkAndPostPercentage() {
    const currentPercentage = getYearCompletionPercentage();

    if (currentPercentage !== lastPercentage) {
        lastPercentage = currentPercentage;

        const progressBarMessage = generateProgressBar(currentPercentage);
        bot.sendMessage(CHANNEL_ID, progressBarMessage);
    }
}


setInterval(checkAndPostPercentage, 15 * 60 * 1000);


checkAndPostPercentage();

console.log('Бот запущен и публикует обновления.');