const mongoose = require("mongoose");
const { Address } = require("../models/address");
const { Users } = require("../models/users");

const addAddress = async (req, res) => {
  const {
    landmark,
    city,
    state,
    country,
    street,
    phone,
    houseNumber,
    pinCode,
    name,
    email,
  } = req.body;
  const userId = req.user;

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false, message: "No user found." });
  }

  if (!user) {
    return res.status(404).json({ success: false, message: "No user found." });
  }

  try {
    const newAddress = new Address({
      userId,
      landmark,
      city,
      state,
      country,
      street,
      phone,
      houseNumber,
      pinCode,
      name,
      email,
    });
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newAddress.save({ session: sess });
    user.address.push(newAddress);
    await user.save({ session: sess });
    await sess.commitTransaction();
    !newAddress
      ? res
          .status(301)
          .json({ success: false, message: "Address could not saved." })
      : res
          .status(201)
          .json({ success: true, message: "Address Added successful." });
  } catch (error) {
    console.error(error);
    return res
      .status(402)
      .json({ success: false, message: "there is a problem in sever." });
  }
};

//get address controller
const getAddress = async (req, res) => {
  const userId = req.user;

  try {
    const user = await Users.findById(userId).populate("address");
    const addresses = user.address;
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

const addressbyId = async (req, res) => {
  const { addressId } = req.params;
  console.log(addressId);
  try {
    const address = await Address.findById(addressId);
    !address
      ? res
          .status(301)
          .json({ success: false, message: "failed to find saved address" })
      : res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(402).json({ success: false, message: "Problem in server" });
  }
};

//update address controller

const updateAddress = async (req, res) => {
  const {
    landmark,
    city,
    state,
    country,
    street,
    phone,
    houseNumber,
    pinCode,
    email,
    name,
  } = req.body;
  const { addressId } = req.params;
  const userId = req.user;
  try {
    const address = await Address.findByIdAndUpdate(addressId, {
      userId,
      landmark,
      city,
      state,
      country,
      street,
      phone,
      houseNumber,
      pinCode,
      email,
      name,
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

module.exports = {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  addressbyId,
};
