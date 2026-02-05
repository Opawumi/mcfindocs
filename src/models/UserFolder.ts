import mongoose, { Schema, Document } from 'mongoose';

export interface IUserFolder extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    parentId?: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const UserFolderSchema: Schema = new Schema({
    name: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'UserFolder', default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

export default mongoose.models.UserFolder || mongoose.model<IUserFolder>('UserFolder', UserFolderSchema);
