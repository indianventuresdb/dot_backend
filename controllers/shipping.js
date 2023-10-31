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
    console.log(pincode, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getKey, checkPincodeService };
