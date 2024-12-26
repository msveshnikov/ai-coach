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
app.get('/', async (req, res) => {
    const html = fs.readFileSync(join(__dirname, '../dist/landing.html'), 'utf8');
    res.send(html);
});
app.use(express.static(join(__dirname, '../dist'), { maxAge: '3d' }));
app.use(morgan('dev'));
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});

app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['coach', 'club'], default: 'coach' },
    certifications: [String],
    experience: String,
    achievements: [String],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

const ExerciseSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    ageGroup: String,
    category: String,
    videoUrl: String,
    restrictions: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const TeamSchema = new mongoose.Schema({
    name: String,
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coaches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    players: [
        {
            name: String,
            position: String,
            stats: Object
        }
    ]
});

const User = mongoose.model('User', UserSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);
const Team = mongoose.model('Team', TeamSchema);

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const generateAIResponse = async (prompt, model, temperature = 0.5) => {
    switch (model) {
        case 'gpt-4o':
        case `o1-mini`:
        case 'gpt-4o-mini': {
            const completion = await openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }]
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
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-training', async (req, res) => {
    try {
        const { prompt, model = 'gpt-4o', temperature } = req.body;
        const exercise = await generateAIResponse(prompt, model, temperature);
        res.json({ exercise });
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

app.get('/api/exercises', async (req, res) => {
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

app.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find({ club: req.user.id }).populate('coaches', 'email');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
