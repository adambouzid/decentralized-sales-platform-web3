import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export const ConnectWallet: React.FC = () => {
    const { account, isConnected, connect, disconnect } = useWeb3();

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
            alert('Failed to connect wallet. Please make sure MetaMask is installed.');
        }
    };

    if (isConnected && account) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                    {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
            Connect Wallet
        </button>
    );
};
