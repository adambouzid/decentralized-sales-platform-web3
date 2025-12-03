import React, { useState } from 'react';
import { parseEther } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { getContractWithSigner } from '../utils/web3';
import { CONTRACT_ADDRESS, API_BASE_URL } from '../config/constants';
import axios from 'axios';

export const CreateProductForm: React.FC = () => {
    const { provider, account, isConnected } = useWeb3();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        imageData: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, imageUrl: '', imageData: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected || !provider || !account) {
            alert('Please connect your wallet first');
            return;
        }

        if (!CONTRACT_ADDRESS) {
            alert('Contract address not configured. Please deploy the contract first.');
            return;
        }

        setLoading(true);

        try {
            // Convert price to Wei
            const priceInWei = parseEther(formData.price);

            // Get contract with signer
            const contract = await getContractWithSigner(provider, CONTRACT_ADDRESS);

            // Create product on blockchain
            const tx = await contract.createProduct(
                formData.name,
                formData.description,
                priceInWei
            );

            console.log('Transaction sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);

            // Extract product ID from event
            const productCreatedEvent = receipt.logs.find(
                (log: any) => log.fragment?.name === 'ProductCreated'
            );

            let productId = 0;
            if (productCreatedEvent) {
                productId = Number(productCreatedEvent.args[0]);
            } else {
                // Fallback: get product count
                const count = await contract.getProductCount();
                productId = Number(count);
            }

            const metadataPayload = {
                productId,
                name: formData.name,
                description: formData.description,
                price: priceInWei.toString(),
                imageData: formData.imageData || undefined,
                imageUrl: formData.imageData ? undefined : formData.imageUrl || 'https://via.placeholder.com/400x300/4F46E5/ffffff?text=Product',
                seller: account,
                metadataHash: tx.hash,
            };

            await axios.post(`${API_BASE_URL}/products`, metadataPayload);

            alert('Product created successfully!');
            setFormData({ name: '', description: '', price: '', imageUrl: '', imageData: '' });
            setImagePreview('');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">List a New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your product"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.001"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image
                    </label>
                    <div className="space-y-3">
                        {/* File Upload */}
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview('');
                                        setFormData({ ...formData, imageUrl: '', imageData: '' });
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* OR URL Option */}
                        <div className="text-center text-sm text-gray-500">OR</div>
                        <input
                            type="url"
                            value={imagePreview ? '' : formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, imageData: '' })}
                            disabled={!!imagePreview}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder="https://example.com/image.jpg (optional)"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isConnected}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};
