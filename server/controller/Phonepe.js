const axios = require("axios");
const sha256 = require("js-sha256");
const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const merchantId = "PGTESTPAYUAT";

const Phonepe = async (transectionID, grandTotal, req, res) => {
  try {
    let data = {
      merchantId: merchantId,
      merchantTransactionId: transectionID,
      merchantUserId: "MU933037302229373",
      amount: grandTotal * 100,
      redirectUrl: `http://localhost:3000/flight/processbooking?transactionId=${transectionID}`,
      redirectMode: "REDIRECT",
      callbackUrl: "https://webhook.site/callback-url",
      mobileNumber: "8521558614",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    let encodedPayload = btoa(JSON.stringify(data));
    let xVerifyChecksum =
      sha256(encodedPayload + "/pg/v1/pay" + saltKey) + "###" + 1;

    const options = {
      method: "post",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyChecksum,
      },
      data: {
        request: encodedPayload,
      },
    };
    await axios
      .request(options)
      .then(function (response) {
        res.json(response.data.data.instrumentResponse.redirectInfo.url);
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    console.log(error);
  }
};
const checkStatus = async (transectionID, req, res) => {
  const transectionId = transectionID;

  let xVerifyChecksum =
    sha256(`/pg/v1/status/${merchantId}/${transectionId}` + saltKey) +
    "###" +
    1;

  const options = {
    method: "get",
    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transectionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": xVerifyChecksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };
  // CHECK PAYMENT STATUS
  try {
    const response = await axios.request(options);
    if (response.data.success === true) {
      return response.data;
    } else {
      throw new Error("Payment status check failed");
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  Phonepe,
  checkStatus,
};
