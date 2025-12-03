import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    productId: number;
    name: string;
    description: string;
    price: string;
    imageData?: string;
    imageUrl?: string;
    seller: string;
    buyer?: string;
    sold: boolean;
    metadataHash?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        productId: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        imageData: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        seller: {
            type: String,
            required: true,
        },
        buyer: {
            type: String,
        },
        sold: {
            type: Boolean,
            default: false,
        },
        metadataHash: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
