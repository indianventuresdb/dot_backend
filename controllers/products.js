
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
}
const removeProducts = async (req, res) => { }
const updateProducts = async (req, res) => { }
const getProducts = async (req, res) => { }
const searchProducts = async (req, res) => { }

export { addProducts, removeProducts, updateProducts, getProducts, searchProducts }