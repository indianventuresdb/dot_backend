const { Orders } = require("../models/orders");
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
      data.baseUrl + "/c/api/pin-codes/json/?filter_codes=" + pincode,
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

const getWayBill = async (req, res) => {
  try {
    const response = await fetch(
      data.baseUrl + "/waybill/api/bulk/json/?count=1",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${data.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error");
    }
    const responseData = await response.json();
    res.status(201).json({ waybill: responseData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const placeDispatch = async (req, res) => {
  const formData = req.body;
  const { orderId, waybill } = formData;

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${data.token}`);
  myHeaders.append("Content-Type", "application/json");

  const requestData = {
    shipments: formData.shipments,
    pickup_location: formData.pickup_location,
  };

  const raw = "format=json&data=" + JSON.stringify(requestData);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(data.baseUrl + "/api/cmu/create.json", requestOptions)
    .then((response) => response.json())
    .then(async (result) => {
      if (result.success === true) {
        console.log("waybill before update:", waybill);
        await Orders.findByIdAndUpdate(orderId, {
          status: "Dispatched",
          wayBill: waybill,
        });
        res.status(201).json({ message: "Dispatch Placed", result: result });
      } else {
        res.status(302).json({ message: "Dispatch Failed", result: result });
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal Server Error" })
    );
};

const trackShipmentByWayBill = async (req, res) => {
  try {
    const { wayBill } = req.query;
    const response = await fetch(
      data.baseUrl + "/api/v1/packages/json/?waybill=" + wayBill,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${data.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error in shipment");
    }
    const responseData = await response.json();
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateShipmentLabel = async (req, res) => {
  try {
    const { wayBill } = req.query;
    const response = await fetch(
      data.baseUrl + `/api/p/packing_slip?wbns=${wayBill}&pdf=true`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${data.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error in shipment label generation");
    }
    const responseData = await response.json();
    res.status(201).json({ message: "Shipment Generated", data: responseData });
  } catch (error) {}
};

const pickupRequest = async (req, res) => {
  const formData = req.body.data;
  try {
    const response = await fetch(data.baseUrl + "/​fm/request/new/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${data.token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    const responseData = await response.json();

    res.status(response.status).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const manageNDRPackages = async (req, res) => {
  const formData = req.body.data;
  try {
    const response = await fetch(data.baseUrl + "/​fm/request/new/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${data.token}`,
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error("Error in NDR request");
    }
    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const NDRStatus = async (req, res) => {
  const { upl, verbose } = req.params;
  try {
    const response = await fetch(
      data.baseUrl + "/api/p/update/" + upl + "?verbose=" + verbose,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${data.token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error in fetching status");
    }
    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getKey,
  checkPincodeService,
  getWayBill,
  placeDispatch,
  trackShipmentByWayBill,
  generateShipmentLabel,
  pickupRequest,
  manageNDRPackages,
  NDRStatus,
};
