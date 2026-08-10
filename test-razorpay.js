const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: "rzp_live_TNdSmDOKSX2g6I",
  key_secret: "5GO0yjbVCTn58B1FDUocEjyb",
});

async function test() {
  try {
    console.log("Testing Razorpay Keys...");
    const options = {
      amount: 19900,
      currency: "INR",
      receipt: "receipt_order_test123",
    };
    const order = await instance.orders.create(options);
    console.log("Success! Order ID:", order.id);
  } catch (error) {
    console.error("Error:", error.error?.description || error.message || error);
  }
}

test();
