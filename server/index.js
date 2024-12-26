import express from 'express';
import cors from 'cors';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {});

app.post('/api/generate-message', async (req, res) => {
    try {
        const { input } = req.body;
        console.log(input);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: input }]
        });

        res.json({ textResponse: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'An error occurred while generating the message' });
    }
});

app.get('*', async (req, res) => {
    return res.send(fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}`, `Exception origin: ${origin}`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
