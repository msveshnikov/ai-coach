import mongoose from 'mongoose';

const WaitlistSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Waitlist = mongoose.model('Waitlist', WaitlistSchema);

export default Waitlist;
