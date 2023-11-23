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
  const formData = req.body;
  console.log(formData);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${data.token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestData = {
    shipments: formData.shipments,
    pickup_location: formData.pickup_location,
  };

  // const raw = "format=json&data=" + JSON.stringify(requestData);

  const raw =
    'format=json&data={\r\n    "shipments": [\r\n        {\r\n            "name": "Chandan Rajput",\r\n            "add": "Dehradun",\r\n            "pin": "248001",\r\n            "city": "Dehradun",\r\n            "state": "Uttrakhand",\r\n            "country": "India",\r\n            "phone": "1234567890",\r\n            "order": "100",\r\n            "payment_mode": "Prepaid",\r\n            "return_pin": "",\r\n            "return_city": "",\r\n            "return_phone": "",\r\n            "return_add": "",\r\n            "return_state": "",\r\n            "return_country": "",\r\n            "products_desc": "",\r\n            "hsn_code": "",\r\n            "cod_amount": "0",\r\n            "order_date": "",\r\n            "total_amount": "0",\r\n            "seller_add": "",\r\n            "seller_name": "",\r\n            "seller_inv": "",\r\n            "quantity": "5",\r\n            "waybill": "25925310000066",\r\n            "shipment_width": "5",\r\n            "shipment_height": "5",\r\n            "weight": "10",\r\n            "seller_gst_tin": "",\r\n            "shipping_mode": "",\r\n            "address_type": "home"\r\n        }\r\n    ],\r\n    "pickup_location": {\r\n        "name": "Augse",\r\n        "add": "Address",\r\n        "city": "Dehradun",\r\n        "pin_code": 248005,\r\n        "country": "India",\r\n        "phone": "123456789"\r\n    }\r\n}';

  console.log(raw);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      data.baseUrl + "/cmu/create.json",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`API error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    res.status(201).json({ message: "Dispatch placed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getKey, checkPincodeService, placeDispatch };
