import mongoose, { Schema, Document } from 'mongoose';

export interface IMemo extends Document {
    from: string;
    fromName: string;
    fromDept: string;
    fromDesignation: string;
    to: string[];
    cc: string[];
    subject: string;
    sideNote?: string;
    recommender?: string[];
    approver?: string[];
    message: string;
    status: 'initiated' | 'pending' | 'reviewed' | 'approved';
    isFinancial: boolean;
    isArchived: boolean;
    attachments?: { name: string; url: string }[];
    date: string;
    approvedByName?: string;
    approvedByDept?: string;
    minutes?: {
        authorName: string;
        authorEmail?: string;
        authorDept: string;
        message: string;
        status: 'approved' | 'rejected' | 'comment';
        attachments?: { name: string; url: string }[];
        createdAt: Date;
    }[];
}

const MemoSchema: Schema = new Schema({
    from: { type: String, required: true },
    fromName: { type: String, required: true },
    fromDept: { type: String, required: true },
    fromDesignation: { type: String, required: true },
    to: [{ type: String, required: true }],
    cc: [{ type: String }],
    subject: { type: String, required: true },
    sideNote: { type: String },
    recommender: [{ type: String }],
    approver: [{ type: String }],
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['initiated', 'pending', 'reviewed', 'approved'],
        default: 'initiated'
    },
    approvedByName: { type: String },
    approvedByDept: { type: String },
    isFinancial: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    attachments: [{
        name: { type: String },
        url: { type: String }
    }],
    minutes: [{
        authorName: { type: String },
        authorEmail: { type: String },
        authorDept: { type: String },
        message: { type: String },
        status: { type: String, enum: ['approved', 'rejected', 'comment'] },
        attachments: [{
            name: { type: String },
            url: { type: String }
        }],
        createdAt: { type: Date, default: Date.now }
    }],
    date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
}, {
    timestamps: true
});

export default mongoose.models.Memo || mongoose.model<IMemo>('Memo', MemoSchema);
