import React from 'react';
import { formatEther } from 'ethers';

export interface Product {
    _id?: string;
    productId: number;
    name: string;
    description: string;
    price: string;
    imageUrl?: string;
    seller: string;
    buyer?: string;
    sold: boolean;
}

interface ProductCardProps {
    product: Product;
    onPurchase?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase }) => {
    const priceInEth = formatEther(product.price);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {product.imageUrl && !product.imageUrl.includes('via.placeholder.com') ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                            const span = document.createElement('span');
                            span.textContent = '📦';
                            span.className = 'text-white text-6xl absolute';
                            e.currentTarget.parentElement?.appendChild(span);
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-6xl">📦</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{priceInEth} ETH</p>
                        <p className="text-xs text-gray-500">
                            Seller: {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                        </p>
                    </div>
                    {product.sold ? (
                        <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium">
                            Sold
                        </span>
                    ) : (
                        <button
                            onClick={() => onPurchase?.(product.productId)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
