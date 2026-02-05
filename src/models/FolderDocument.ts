import mongoose, { Schema, Document } from 'mongoose';

export interface IFolderDocument extends Document {
    _id: mongoose.Types.ObjectId;
    folderId: mongoose.Types.ObjectId | string;
    documentId: string; // Reference to actual document
    addedAt: Date;
    addedBy: mongoose.Types.ObjectId | string;
}

const FolderDocumentSchema: Schema = new Schema({
    folderId: { type: Schema.Types.ObjectId, ref: 'UserFolder', required: true },
    documentId: { type: String, required: true }, // Could be memo ID, file ID, etc.
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now },
}, {
    timestamps: false
});

// Index for faster lookups
FolderDocumentSchema.index({ folderId: 1 });
FolderDocumentSchema.index({ documentId: 1 });

export default mongoose.models.FolderDocument || mongoose.model<IFolderDocument>('FolderDocument', FolderDocumentSchema);
