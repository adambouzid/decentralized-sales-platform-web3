import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getContractWithSigner, getReadOnlyContract } from '../utils/web3';
import { CONTRACT_ADDRESS, API_BASE_URL, GANACHE_URL } from '../config/constants';
import { ProductCard, type Product } from '../components/ProductCard';
import axios from 'axios';

export const ProductList: React.FC = () => {
    const { provider, isConnected } = useWeb3();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        if (!CONTRACT_ADDRESS || !GANACHE_URL) {
            console.warn('Contract address or RPC URL missing');
            setLoading(false);
            return;
        }

        try {
            const [metadataResponse, chainContract] = await Promise.all([
                axios.get(`${API_BASE_URL}/products`),
                Promise.resolve(getReadOnlyContract(GANACHE_URL, CONTRACT_ADDRESS)),
            ]);

            const metadataMap = metadataResponse.data.reduce(
                (acc: Record<number, (Product & { _id?: string })>, item: Product & { productId: number }) => {
                    acc[item.productId] = item;
                    return acc;
                },
                {}
            );

            const productCount = Number(await chainContract.getProductCount());
            const mergedProducts: Product[] = [];

            for (let i = 1; i <= productCount; i++) {
                const data = await chainContract.getProduct(BigInt(i));
                if (!data.name || data.name.length === 0) {
                    continue;
                }

                const metadata = metadataMap[i];
                mergedProducts.push({
                    productId: Number(data.id ?? i),
                    name: metadata?.name ?? data.name,
                    description: metadata?.description ?? data.description,
                    price: metadata?.price ?? data.price?.toString?.() ?? '0',
                    seller: data.seller,
                    buyer: metadata?.buyer ?? (data.buyer && data.buyer !== '0x0000000000000000000000000000000000000000' ? data.buyer : undefined),
                    sold: metadata?.sold ?? Boolean(data.sold),
                    imageUrl: metadata?.imageUrl ?? metadata?.imageData ?? undefined,
                    _id: metadata?._id,
                });
            }

            setProducts(mergedProducts);
        } catch (error) {
            console.error('Error fetching products from chain:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (productId: number) => {
        if (!isConnected || !provider) {
            alert('Please connect your wallet first');
            return;
        }

        if (!CONTRACT_ADDRESS) {
            alert('Contract address not configured');
            return;
        }

        try {
            const product = products.find((p) => p.productId === productId);
            if (!product) return;

            const contract = await getContractWithSigner(provider, CONTRACT_ADDRESS);

            const tx = await contract.purchaseProduct(BigInt(productId), {
                value: BigInt(product.price),
            });

            console.log('Purchase transaction sent:', tx.hash);
            await tx.wait();
            console.log('Purchase confirmed');

            alert('Purchase successful!');
            fetchProducts();
        } catch (error) {
            console.error('Error purchasing product:', error);
            alert('Failed to purchase product. Check console for details.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading products...</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">No products available yet</p>
                    <a
                        href="/create"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
                    >
                        List Your First Product
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product._id || product.productId}
                        product={product}
                        onPurchase={handlePurchase}
                    />
                ))}
            </div>
        </div>
    );
};
