import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    stats: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    age: Number,
    injuries: [
        {
            type: String,
            date: Date,
            recoveryTime: Number
        }
    ],
    performance: {
        type: Map,
        of: Number,
        default: {}
    }
});

const TeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        club: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        coaches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        players: [playerSchema],
        category: {
            type: String,
            required: true,
            trim: true
        },
        season: {
            type: String,
            required: true
        },
        philosophy: {
            type: String,
            trim: true
        },
        resources: [
            {
                name: String,
                type: String,
                availability: Boolean
            }
        ],
        schedule: [
            {
                date: Date,
                type: String,
                location: String,
                duration: Number
            }
        ],
        analytics: {
            performance: Map,
            attendance: Map,
            progress: Map
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

TeamSchema.virtual('exercises', {
    ref: 'Exercise',
    localField: '_id',
    foreignField: 'team'
});

export default mongoose.model('Team', TeamSchema);
