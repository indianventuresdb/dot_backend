const data = require("../config/delhivery");

const getKey = async (req, res) => {
  try {
    res.status(200).json({ key: data.token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkPincodeService = async (req, res) => {
  const { pincode } = req.query;
  try {
    const response = await fetch(
      data.baseUrl + "/pin-codes/json/?filter_codes=" + pincode,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${data.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error");
    }
    const responseData = await response.json();
    res.status(200).json({ codes: responseData.delivery_codes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const placeDispatch = async (req, res) => {
  const formData = req.body.data;
  console.log(formData);
  try {
    const response = await fetch(data.baseUrl + "/cmu/create.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${data.token}`,
      },
      body: (formData),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    console.log(responseData);
    res.status(201).json({ message: "Dispatch placed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getKey, checkPincodeService, placeDispatch };
