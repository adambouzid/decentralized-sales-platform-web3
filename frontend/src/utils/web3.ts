import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';

export type MarketplaceContract = Contract & {
    createProduct(name: string, description: string, price: bigint): Promise<any>;
    purchaseProduct(id: bigint, options: { value: bigint }): Promise<any>;
    getProduct(id: bigint): Promise<any>;
    getProductCount(): Promise<bigint>;
}

const MARKETPLACE_ABI = [
    "function createProduct(string memory _name, string memory _description, uint256 _price) public returns (uint256)",
    "function purchaseProduct(uint256 _id) public payable",
    "function getProduct(uint256 _id) public view returns (uint256 id, string memory name, string memory description, uint256 price, address seller, address buyer, bool sold)",
    "function getProductCount() public view returns (uint256)",
    "event ProductCreated(uint256 indexed id, string name, uint256 price, address indexed seller)",
    "event ProductPurchased(uint256 indexed id, address indexed buyer, address indexed seller, uint256 price)"
];

const resolveInjectedProvider = (): Eip1193Provider | undefined => {
    if (typeof window === 'undefined') {
        return undefined;
    }

    const { ethereum } = window;
    if (!ethereum) {
        return undefined;
    }

    const multiProvider = (ethereum as any).providers;
    if (Array.isArray(multiProvider) && multiProvider.length > 0) {
        const metaMaskProvider = multiProvider.find((provider: any) => provider.isMetaMask);
        return (metaMaskProvider ?? multiProvider[0]) as Eip1193Provider;
    }

    return ethereum as Eip1193Provider;
};

export const connectWallet = async (): Promise<{ provider: BrowserProvider; address: string }> => {
    const injectedProvider = resolveInjectedProvider();

    if (!injectedProvider) {
        throw new Error('No injected provider found');
    }

    const provider = new BrowserProvider(injectedProvider);
    const accounts = await provider.send('eth_requestAccounts', []);

    return {
        provider,
        address: accounts[0],
    };
};

export const getContract = (
    provider: BrowserProvider,
    contractAddress: string
): MarketplaceContract => {
    return new Contract(contractAddress, MARKETPLACE_ABI, provider) as MarketplaceContract;
};

export const getContractWithSigner = async (
    provider: BrowserProvider,
    contractAddress: string
): Promise<MarketplaceContract> => {
    const signer = await provider.getSigner();
    return new Contract(contractAddress, MARKETPLACE_ABI, signer) as MarketplaceContract;
};

export const getReadOnlyContract = (
    rpcUrl: string,
    contractAddress: string
): MarketplaceContract => {
    const provider = new JsonRpcProvider(rpcUrl);
    return new Contract(contractAddress, MARKETPLACE_ABI, provider) as MarketplaceContract;
};

declare global {
    interface Window {
        ethereum?: Eip1193Provider & {
            providers?: Eip1193Provider[];
        };
    }
}