import { Products } from "../models/products.js";


// Add Product to database
const addProducts = async (req, res) => {
    const {
        productName,
        productType,
        shortDescription,
        tags,
        tax,
        indicator,
        madeIn,
        brand,
        totalAllowedQuantity,
        minOrderQuantity,
        qualityStepSize,
        warrantyPeriod,
        guaranteePeriod,
        deliverableType,
        deliverableZipcodes,
        hsnCode,
        taxIncludedPrice,
        isCodAllowed,
        isReturnAble,
        isCancelAble,
        mrp,
        currentPrice,
        mainImage,
        otherImage,
        productVideo,
        description,
    } = req.body
    try {
        const product = await Products.create({
            productName,
            productType,
            sellerID: req.sellerID,
            shortDescription,
            tags,
            tax,
            indicator,
            madeIn,
            brand,
            totalAllowedQuantity,
            minOrderQuantity,
            qualityStepSize,
            warrantyPeriod,
            guaranteePeriod,
            deliverableType,
            deliverableZipcodes,
            hsnCode,
            taxIncludedPrice,
            isCodAllowed,
            isReturnAble,
            isCancelAble,
            mrp,
            currentPrice,
            mainImage,
            otherImage,
            productVideo,
            description,
        })
        if (!product) {
            return res.status(400).json({ message: "Product add failed..." })
        }
        return res.status(200).json({ message: "Product added successfully." })
    } catch (error) {
        return res.status(300).json({ message: "Product add failed..." })
    }
}

// Remove Product from database
const removeProducts = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Products.findByIdAndDelete(productId);
        // Turnory oprator
        !product ?
            res.status(300).json({ message: "Product Can not deleted." }) :
            res.status(200).json({ message: "Product successfully deleted." })
    } catch (error) {
        res.status(300).json({ message: "Product Can not deleted." });
    }
}

// Update Product in Database
const updateProducts = async (req, res) => {
    const { productId } = req.params
    const {
        productName,
        productType,
        sellerID,
        shortDescription,
        tags,
        tax,
        indicator,
        madeIn,
        brand,
        totalAllowedQuantity,
        minOrderQuantity,
        qualityStepSize,
        warrantyPeriod,
        guaranteePeriod,
        deliverableType,
        deliverableZipcodes,
        hsnCode,
        taxIncludedPrice,
        isCodAllowed,
        isReturnAble,
        isCancelAble,
        mrp,
        currentPrice,
        mainImage,
        otherImage,
        productVideo,
        description,
    } = req.body
    try {
        const product = await Products.findByIdAndUpdate(productId, {
            productName,
            productType,
            sellerID,
            shortDescription,
            tags,
            tax,
            indicator,
            madeIn,
            brand,
            totalAllowedQuantity,
            minOrderQuantity,
            qualityStepSize,
            warrantyPeriod,
            guaranteePeriod,
            deliverableType,
            deliverableZipcodes,
            hsnCode,
            taxIncludedPrice,
            isCodAllowed,
            isReturnAble,
            isCancelAble,
            mrp,
            currentPrice,
            mainImage,
            otherImage,
            productVideo,
            description,
        });
        // Turnory Oprator
        !product ?
            res.status(300).json({ message: "Product can not updated" }) :
            res.status(200).json({ message: "Product updated successfully" })
    } catch (error) {
        res.status(300).json({ message: "Product can not updated" })
    }
}


// get All products from database and send to Browser
const getProducts = async (req, res) => {
    try {
        const products = await Products.find();
        !products ?
            res.status(404).json({ message: "Products not found." }) :
            res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: "Products fetching failed." })
    }
}

// serach products
const searchProducts = async (req, res) => {
    const { searchString } = req.params;

}

// get one product
const getOneProduct = async (req, res) => {
    const { productId } = req.params
    try {
        const product = await Products.findById(productId)
        !product ?
            res.status(404).json({ message: "Product not found erorr 404" }) :
            res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: "Product not found erorr 404" })
    }
}


export { addProducts, removeProducts, updateProducts, getProducts, searchProducts, getOneProduct }