import express, { type Router, type Request, type Response } from 'express';
import Product from '../models/Product.js';

const router: Router = express.Router();

// Get all products metadata
router.get('/', async (_req: Request, res: Response) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Get single product metadata
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Create/update product metadata for given on-chain product
router.post('/', async (req: Request, res: Response) => {
    try {
        const { productId, name, description, price, imageData, imageUrl, seller, metadataHash } = req.body;

        if (productId === undefined || productId === null || !name || !description || !price || !seller) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const numericProductId = Number(productId);
        if (Number.isNaN(numericProductId) || numericProductId <= 0) {
            return res.status(400).json({ message: 'productId must be a positive number' });
        }

        if (!imageData && !imageUrl) {
            return res.status(400).json({ message: 'imageData or imageUrl is required' });
        }

        const product = await Product.findOneAndUpdate(
            { productId: numericProductId },
            {
                productId: numericProductId,
                name,
                description,
                price,
                imageData,
                imageUrl,
                seller,
                metadataHash,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product metadata', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// Update product (mark as sold)
router.patch('/:productId/sold', async (req: Request, res: Response) => {
    try {
        const { buyer } = req.body;
        const product = await Product.findOneAndUpdate(
            { productId: Number(req.params.productId) },
            { sold: true, buyer },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// Clear all products (for testing/reset)
router.delete('/admin/clear', async (_req: Request, res: Response) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'All products cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing products', error });
    }
});

export default router;
