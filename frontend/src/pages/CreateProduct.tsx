import React from 'react';
import { CreateProductForm } from '../components/CreateProductForm';

export const CreateProduct: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CreateProductForm />
        </div>
    );
};
