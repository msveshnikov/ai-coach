import express from 'express';
import cors from 'cors';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getTextClaude } from './claude.js';
import { getTextGemini } from './gemini.js';
import User from './models/User.js';
import Exercise from './models/Exercise.js';
import Team from './models/Team.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const checkPremiumAccess = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.subscription !== 'premium') {
        return res.status(403).json({ error: 'Premium subscription required' });
    }
    next();
};

const generateAIResponse = async (prompt, model, temperature = 0.7) => {
    switch (model) {
        case 'gpt-4o':
        case 'o1-mini':
        case 'gpt-4o-mini': {
            const completion = await openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature
            });
            return completion.choices[0].message.content;
        }
        case 'claude-3-5-sonnet-20241022':
            return await getTextClaude(prompt, model, temperature);
        case 'gemini-exp-1206':
        case 'gemini-2.0-flash-exp':
            return await getTextGemini(prompt, model, temperature);
        default:
            throw new Error('Invalid model specified');
    }
};

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({
            token,
            user: { email: user.email, role: user.role, subscription: user.subscription }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-training', async (req, res) => {
    try {
        console.log(req.body);
        const { prompt, model = 'gpt-4o', temperature } = req.body;
        const result = await generateAIResponse(prompt, model, temperature);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/exercises', authenticateToken, async (req, res) => {
    try {
        const exercise = new Exercise({ ...req.body, createdBy: req.user.id });
        await exercise.save();
        res.status(201).json(exercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.find().populate('createdBy', 'email role');
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/teams', authenticateToken, async (req, res) => {
    try {
        const team = new Team({ ...req.body, club: req.user.id });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/teams', authenticateToken, async (req, res) => {
    try {
        const teams = await Team.find({ $or: [{ club: req.user.id }, { coaches: req.user.id }] })
            .populate('coaches', 'email')
            .populate('club', 'email');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/analytics', [authenticateToken, checkPremiumAccess], async (req, res) => {
    try {
        const { teamId, type, data } = req.body;
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        const analyticsData = await generateAIResponse(JSON.stringify({ type, data }), 'gpt-4o');

        res.json({ analytics: analyticsData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/resources/book', authenticateToken, async (req, res) => {
    try {
        const { teamId, resourceId, date, duration } = req.body;
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        const booking = {
            date: new Date(date),
            duration,
            team: teamId
        };

        await Team.findOneAndUpdate(
            { 'resources._id': resourceId },
            { $push: { 'resources.$.bookings': booking } }
        );

        res.json({ message: 'Resource booked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});

app.get('*', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/index.html'), 'utf8');
    if (!req.path.startsWith('/training/')) {
        return res.send(html);
    }
    // const slug = req.path.substring(10);
    // const enrichedHtml = await enrichMetadata(html, slug);
    // res.send(enrichedHtml);
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

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';
