const { Address } = require("../models/address");

const addAddress = async (req, res) => {
  const { landmark, city, state, country, street, houseNumber, pinCode } =
    req.body;
  const { userId } = req.user;
  try {
    const address = await Address.create({
      userId,
      houseNumber,
      street,
      country,
      state,
      city,
      landmark,
      pinCode,
    });
    !address
      ? res
          .status(301)
          .json({ success: false, message: "Address could not saved." })
      : res
          .status(201)
          .json({ success: true, message: "Address Added successful." });
  } catch (error) {
    console.error("Address creation failed.");
    return res
      .status(402)
      .json({ success: false, message: "there is a problem in sever." });
  }
};

//get address controller
const getAddress = async (req, res) => {
  const userId = req.user;

  try {
    const addresses = await Address.find({ userId });
    !addresses
      ? res
          .status(301)
          .json({ success: false, message: "failed to find saved address" })
      : res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.log("failed to finding errors ");
    res.status(402).json({ success: false, message: "Problem in server" });
  }
};

//update address controller

const updateAddress = async (req, res) => {
  const {
    addressId,
    landmark,
    city,
    state,
    country,
    street,
    houseNumber,
    pinCode,
  } = req.body;
  const { userId } = req.user;
  try {
    const address = await Address.findByIdAndUpdate(addressId, {
      userId,
      houseNumber,
      street,
      country,
      state,
      city,
      landmark,
      pinCode,
    });
    !address
      ? res
          .status(301)
          .json({ success: false, message: "Address could not updated." })
      : res
          .status(201)
          .json({ success: true, message: "Address updated successful." });
  } catch (error) {
    console.error("Address updation failed.");
    return res
      .status(402)
      .json({ success: false, message: "there is a problem in server." });
  }
};

//delete address controller
const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    const address = await Address.findByIdAndDelete(addressId);
    !address
      ? res
          .status(302)
          .json({ success: false, message: "Address could not deleted." })
      : res.status(302).json({ success: true, message: "Address deleted." });
  } catch (error) {
    console.error("Address could not deleted.");
    res
      .status(302)
      .json({ success: false, message: "Address could not deleted." });
  }
};

module.exports = { addAddress, getAddress, updateAddress, deleteAddress };
