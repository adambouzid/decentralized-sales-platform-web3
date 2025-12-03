import React from 'react';
import { ConnectWallet } from './ConnectWallet';
import { useNavigation } from '../App';

export const Header: React.FC = () => {
    const { navigate } = useNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, page: 'list' | 'create') => {
        e.preventDefault();
        navigate(page);
    };

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Decentralized Marketplace
                        </h1>
                    </div>
                    <nav className="flex items-center gap-6">
                        <a
                            href="/"
                            onClick={(e) => handleClick(e, 'list')}
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Products
                        </a>
                        <a
                            href="/create"
                            onClick={(e) => handleClick(e, 'create')}
                            className="text-gray-700 hover:text-gray-900 font-medium"
                        >
                            Sell
                        </a>
                        <ConnectWallet />
                    </nav>
                </div>
            </div>
        </header>
    );
};
