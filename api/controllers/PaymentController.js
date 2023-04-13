const stripe = require('stripe')('sk_test_51MXchGCLZZaEdOAQhPVG5JGpygkXanZFW8FcALo8FV9pX6OtwhcSzv7cGAbyQlNmVIloy84bIHLpzBatMvIwu4EU00QMvX01t9');

exports.getPaymentIntent = async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const amount = req.body.amount;
  console.log(amount);
  console.log("get payment sheet");
  if(!amount || amount < 50){
    return res.status(404).json({
      success: false,
      message: "Amount not enough",
    });
  }
  const customer = await stripe.customers?.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "eur",
    customer: customer.id,
    payment_method_types: ["card"],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51MXchGCLZZaEdOAQjng17YfEiWZsjEMH6AXq2PPX2A12EHVcw4a5ZpIwNHDVa6nhnIlaPrptHeaeR8ETDMcBQp3b004XuyYnYy",
  });
};
