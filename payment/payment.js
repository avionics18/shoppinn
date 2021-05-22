const express = require("express");
const router = express.Router();
const https = require("https");
const qs = require("querystring");
const checksum_lib = require("./checksum");

// Route for making payment
router.post("/paynow", (req, res) => {
	let paymentDetails = {
		amount: req.body.amount,
		customerId: req.body.name,
		customerEmail: req.body.email,
		customerPhone: req.body.phone,
	};

	if (
		!paymentDetails.amount ||
		!paymentDetails.customerId ||
		!paymentDetails.customerEmail ||
		!paymentDetails.customerPhone
	) {
		res.status(400).send("Payment failed");
	} else {
		let params = {};
		params["MID"] = process.env.MID;
		params["WEBSITE"] = process.env.WEBSITE;
		params["CHANNEL_ID"] = "WEB";
		params["INDUSTRY_TYPE_ID"] = "Retail";
		params["ORDER_ID"] = "TEST_" + new Date().getTime();
		params["CUST_ID"] = paymentDetails.customerId;
		params["TXN_AMOUNT"] = paymentDetails.amount;
		params["CALLBACK_URL"] = "https://shoppinn.herokuapp.com/callback";
		params["EMAIL"] = paymentDetails.customerEmail;
		params["MOBILE_NO"] = paymentDetails.customerPhone;

		checksum_lib.genchecksum(
			params,
			process.env.KEY,
			function (err, checksum) {
				let txn_url =
					"https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
				// let txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

				let form_fields = "";
				for (let x in params) {
					form_fields +=
						"<input type='hidden' name='" +
						x +
						"' value='" +
						params[x] +
						"' >";
				}
				form_fields +=
					"<input type='hidden' name='CHECKSUMHASH' value='" +
					checksum +
					"' >";

				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(
					'<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
						txn_url +
						'" name="f1">' +
						form_fields +
						'</form><script type="text/javascript">document.f1.submit();</script></body></html>'
				);
				res.end();
			}
		);
	}
});

// Route for verifiying payment
router.post("/callback", (req, res) => {
	let body = "";

	req.on("data", function (data) {
		body += data;
	});

	req.on("end", function () {
		let html = "";
		let post_data = qs.parse(body);

		// received params in callback
		console.log("Callback Response: ", post_data, "\n");

		// verify the checksum
		let checksumhash = post_data.CHECKSUMHASH;
		// delete post_data.CHECKSUMHASH;
		let result = checksum_lib.verifychecksum(
			post_data,
			process.env.KEY,
			checksumhash
		);
		console.log("Checksum Result => ", result, "\n");

		// Send Server-to-Server request to verify Order Status
		let params = {
			MID: process.env.MID,
			ORDERID: post_data.ORDERID,
		};

		checksum_lib.genchecksum(
			params,
			process.env.KEY,
			function (err, checksum) {
				params.CHECKSUMHASH = checksum;
				post_data = "JsonData=" + JSON.stringify(params);

				let options = {
					hostname: "securegw-stage.paytm.in", // for staging
					// hostname: 'securegw.paytm.in', // for production
					port: 443,
					path: "/merchant-status/getTxnStatus",
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": post_data.length,
					},
				};

				// Set up the request
				let response = "";
				let post_req = https.request(options, function (post_res) {
					post_res.on("data", function (chunk) {
						response += chunk;
					});

					post_res.on("end", function () {
						console.log("S2S Response: ", response, "\n");

						let _result = JSON.parse(response);
						if (_result.STATUS == "TXN_SUCCESS") {
							res.send("payment sucess");
						} else {
							res.send("payment failed");
						}
					});
				});

				// post the data
				post_req.write(post_data);
				post_req.end();
			}
		);
	});
});

module.exports = router;
