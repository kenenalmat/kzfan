import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import './bot'; // Start bot

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware to authenticate JWT
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ username: user.username }, JWT_SECRET);
    res.json({ token });
});

// Get Events
app.get('/api/events', async (req, res) => {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });
    res.json(events);
});

// Add Event (Protected)
app.post('/api/events', authenticateToken, async (req, res) => {
    try {
        const { sport, team, opponent, date, location, venue, imageUrl } = req.body;
        const event = await prisma.event.create({
            data: {
                sport,
                team,
                opponent,
                date: new Date(date),
                location,
                venue,
                imageUrl
            }
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Delete Event (Protected)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Update Event (Protected)
app.put('/api/events/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { sport, team, opponent, date, location, venue, imageUrl } = req.body;
        const event = await prisma.event.update({
            where: { id: Number(id) },
            data: {
                sport,
                team,
                opponent,
                date: new Date(date),
                location,
                venue,
                imageUrl
            }
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        // Skip if it's an API route
        if (req.path.startsWith('/api/')) {
            return next();
        }
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
