import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import Stripe from "stripe";

const app = express();

const URL = process.env.BASE_URL;

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server Running on Port ${URL}`);
})

const stripe = new Stripe(`${process.env.STRIPI_SECRET_KEY}`);


//// POST getCheckoutSession
app.post('/stripe', async (req, res) => {

  if (req.body.user) {
    try {
      //create checkout session

      const stripeCusId = req.body.user['http://127.0.0.1:5173/stripe_customer_id'];
      const cartItems = req.body.cartItems;


      const session = await stripe.checkout.sessions.create({
        submit_type: 'pay',
        mode: 'payment',
        customer: stripeCusId,
        payment_method_types: ['card'],
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'IN'],
        },
        allow_promotion_codes: true,
        shipping_options: [
          { shipping_rate: "shr_1LdsYOSDNz1i4o349Ut7GoZY" },
          { shipping_rate: "shr_1LdsWXSDNz1i4o34K0OAYqz1" },
        ],
        line_items: cartItems.map((item) => {
          return {
            price_data: {
              currency: 'INR',
              product_data: {
                name: item.title,
                images: [item.imageURL],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),
        //Bring user to success or failure page
        success_url: `${req.headers.origin}/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelled`,
      });

      res.status(200).json(session);


    }
    catch (error) {
      res.status(error.statusCode || 500).json(error.message);
    }
  }
  else {
    try {
      //create checkout session

      const stripeCusId = req.body.user['http://127.0.0.1:5173/stripe_customer_id'];
      const cartItems = req.body.cartItems;


      const session = await stripe.checkout.sessions.create({
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'IN'],
        },
        allow_promotion_codes: true,
        shipping_options: [
          { shipping_rate: "shr_1LdsYOSDNz1i4o349Ut7GoZY" },
          { shipping_rate: "shr_1LdsWXSDNz1i4o34K0OAYqz1" },
        ],
        line_items: cartItems.map((item) => {
          return {
            price_data: {
              currency: 'INR',
              product_data: {
                name: item.title,
                images: [item.imageURL],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),
        //Bring user to success or failure page
        success_url: `${req.headers.origin}/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancelled`,
      });

      res.status(200).json(session);


    }
    catch (error) {
      res.status(error.statusCode || 500).json(error.message);
    }
  }


}
);

//// Get Success data
app.get('/order/:id', async (req, res) => {

  const order = await stripe.checkout.sessions.retrieve(
    req.params.id,
    {
      expand: ["line_items"],
    }
  );

  res.status(200).json(order);

}
);

//// POST getUserOrders
app.post('/userorders', async (req, res) => {
  const user = req.body;

  const stripeCusId = user['http://127.0.0.1:5173/stripe_customer_id'];

  const paymentIntents = await stripe.paymentIntents.list({
    customer: stripeCusId,
  });

  res.status(200).json(paymentIntents.data);

}
);



