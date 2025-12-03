const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
    // Connect to Ganache
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

    // Get signer (first account)
    const signer = await provider.getSigner(0);
    console.log("Deploying from:", await signer.getAddress());

    // Read contract bytecode and ABI
    const contractPath = path.join(__dirname, "../contracts/Marketplace.sol");
    const contractSource = fs.readFileSync(contractPath, "utf8");

    // For simplicity, use the compiled bytecode from Remix
    // You'll need to compile in Remix first and paste the bytecode here

    console.log("\n⚠️  Please compile the contract in Remix IDE:");
    console.log("1. Go to https://remix.ethereum.org/");
    console.log("2. Compile Marketplace.sol with version 0.8.13");
    console.log("3. Copy the bytecode");
    console.log("4. Paste it in this script");
    console.log("\nOr just deploy directly in Remix as explained!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
