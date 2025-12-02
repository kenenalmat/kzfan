import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const prisma = new PrismaClient();

bot.start((ctx) => ctx.reply('Welcome to KZ Fan Bot! Type /events to see upcoming matches.'));

bot.command('events', async (ctx) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' },
            take: 5
        });

        if (events.length === 0) {
            return ctx.reply('No upcoming events found.');
        }

        let message = '📅 *Upcoming Events*\n\n';
        events.forEach(event => {
            const date = new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            message += `*${event.team} vs ${event.opponent}*\n`;
            message += `🏆 ${event.sport}\n`;
            message += `📍 ${event.location}\n`;
            message += `🗓 ${date}\n\n`;
        });

        ctx.replyWithMarkdown(message);
    } catch (error) {
        console.error(error);
        ctx.reply('Error fetching events.');
    }
});

// Launch bot if token is present
if (process.env.TELEGRAM_BOT_TOKEN) {
    bot.launch();
    console.log('Telegram bot started');

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
    console.log('TELEGRAM_BOT_TOKEN not set, bot not started');
}
