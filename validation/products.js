const validator = require('validator');

exports.isProduct = (req, res, next) => {
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
    } = req.body;
    
    if (
        !validator.isEmpty(productName) &&
        !validator.isEmpty(productType) &&
        !validator.isEmpty(shortDescription) &&
        !validator.isEmpty(tags) &&
        !validator.isEmpty(tax) &&
        !validator.isEmpty(indicator) &&
        !validator.isEmpty(madeIn) &&
        !validator.isEmpty(brand) &&
        !validator.isEmpty(totalAllowedQuantity) &&
        !validator.isEmpty(minOrderQuantity) &&
        !validator.isEmpty(qualityStepSize) &&
        !validator.isEmpty(warrantyPeriod) &&
        !validator.isEmpty(guaranteePeriod) &&
        !validator.isEmpty(deliverableType) &&
        !validator.isEmpty(deliverableZipcodes) &&
        !validator.isEmpty(hsnCode) &&
        !validator.isEmpty(taxIncludedPrice) &&
        !validator.isEmpty(isCodAllowed) &&
        !validator.isEmpty(isReturnAble) &&
        !validator.isEmpty(isCancelAble) &&
        !validator.isEmpty(mrp) &&
        !validator.isEmpty(currentPrice) &&
        !validator.isEmpty(mainImage) &&
        !validator.isEmpty(otherImage) &&
        !validator.isEmpty(productVideo) &&
        !validator.isEmpty(description)
    ) {
        next();
    } else {
        return res.status(400).json({ message: "invalid data" });
    }
};
