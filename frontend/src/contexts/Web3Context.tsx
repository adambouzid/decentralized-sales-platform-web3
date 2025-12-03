import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { connectWallet } from '../utils/web3';

interface Web3ContextType {
    provider: BrowserProvider | null;
    account: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const connect = async () => {
        try {
            const { provider: web3Provider, address } = await connectWallet();
            setProvider(web3Provider);
            setAccount(address);
            setIsConnected(true);
            localStorage.setItem('walletConnected', 'true');
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    };

    const disconnect = () => {
        setProvider(null);
        setAccount(null);
        setIsConnected(false);
        localStorage.removeItem('walletConnected');
    };

    useEffect(() => {
        const wasConnected = localStorage.getItem('walletConnected');
        if (wasConnected === 'true') {
            connect().catch(console.error);
        }

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    disconnect();
                } else {
                    setAccount(accounts[0]);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners?.();
            }
        };
    }, []);

    return (
        <Web3Context.Provider value={{ provider, account, isConnected, connect, disconnect }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};
