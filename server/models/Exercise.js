import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true
        },
        ageGroup: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            min: 1
        },
        equipment: [
            {
                type: String
            }
        ],
        videoUrl: {
            type: String,
            trim: true
        },
        images: [
            {
                type: String
            }
        ],
        restrictions: [
            {
                type: String
            }
        ],
        goals: [
            {
                type: String
            }
        ],
        variations: [
            {
                title: String,
                description: String
            }
        ],
        metrics: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        isTemplate: {
            type: Boolean,
            default: false
        },
        aiGenerated: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        }
    },
    {
        timestamps: true
    }
);

exerciseSchema.index({ title: 'text', description: 'text' });

exerciseSchema.pre('save', function (next) {
    if (!this.isModified('title')) return next();
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
    next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
