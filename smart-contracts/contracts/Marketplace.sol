// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Marketplace {
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address payable seller;
        address buyer;
        bool sold;
        bool exists;
    }

    uint256 private productCounter;
    mapping(uint256 => Product) public products;
    
    event ProductCreated(
        uint256 indexed id,
        string name,
        uint256 price,
        address indexed seller
    );
    
    event ProductPurchased(
        uint256 indexed id,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Product name is required");
        require(_price > 0, "Price must be greater than 0");

        productCounter++;
        
        products[productCounter] = Product({
            id: productCounter,
            name: _name,
            description: _description,
            price: _price,
            seller: payable(msg.sender),
            buyer: address(0),
            sold: false,
            exists: true
        });

        emit ProductCreated(productCounter, _name, _price, msg.sender);
        
        return productCounter;
    }

    function purchaseProduct(uint256 _id) public payable {
        Product storage product = products[_id];
        
        require(product.exists, "Product does not exist");
        require(!product.sold, "Product already sold");
        require(msg.value >= product.price, "Insufficient payment");
        require(msg.sender != product.seller, "Seller cannot buy own product");

        product.buyer = msg.sender;
        product.sold = true;

        // Transfer payment to seller
        product.seller.transfer(msg.value);

        emit ProductPurchased(_id, msg.sender, product.seller, product.price);
    }

    function getProduct(uint256 _id) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 price,
        address seller,
        address buyer,
        bool sold
    ) {
        require(products[_id].exists, "Product does not exist");
        Product memory product = products[_id];
        return (
            product.id,
            product.name,
            product.description,
            product.price,
            product.seller,
            product.buyer,
            product.sold
        );
    }

    function getProductCount() public view returns (uint256) {
        return productCounter;
    }
}
