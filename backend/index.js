// database user : Salman-78
// password : xYz@397452

const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

app.use(express.json());

const allowedOrigins = [
  process.env.CORSORIGIN,
  process.env.CORSORIGIN2,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    maxAge:11600,
  })
);
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => console.log("Backend connected with mongodb atlas successfully"))
  .catch((e) =>
    console.error("something went wrong in you backend file check index.js")
  );


app.get("/", (req, res) => {
  res.send("Backend is running successfully at index.js");
});

// image storage engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// create upload endpoint for images

app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,//FIXME
  });
});

// Schema for creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Creating API for adding products

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log(
    "your data was saved in database through addproduct endpoint at index.js data was put by admin panel"
  );
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for deleting products

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Product remove successfully through removeproduct endpoint");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// creating api for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
  console.log("All products are fetched from database successfully");
});

// schema creating for usre model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    unique: true,
    type: String,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(200).json({
      success: false,
      error: "Existing user found with the same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  // jwt authentication
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, process.env.TOKEN);
  res.json({ success: true, token });
});

// creating endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.TOKEN);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "wrong password" });
    }
  } else {
    res.json({ success: false, error: "wrong email id" });
  }
});

// creating endpoint for new collection
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection data are fetched");
  res.send(newcollection);
});

//creating an endpoint for popular in women category
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({});
  let popular_in_women = products.slice(0, 4);
  console.log("new collection data are fetched");
  res.send(popular_in_women);
});

//creating a middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(404).send({ errors: "please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, process.env.TOKEN);
      req.user = data.user;
      next();
    } catch (err) {
      res
        .status(401)
        .send({ errors: "pleaes authenticate using a valid TOKEN" });
    }
  }
};

//creating endpoint for adding products in cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("add to cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "added product to the cart" });
});


//creating endpoint to remove the product from cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("remove", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if(userData.cartData[req.body.itemId] > 0)
  userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json({ message: "remove product from the cart" });
});


//creating endpoint to get cartdata after login
app.post('/getcart', fetchUser, async(req, res)=>{
  console.log("get the cart data");
  let userData=await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})



app.listen(port, (err) => {
  if (!err) {
    console.log("server running on port number: " + port);
  } else {
    console.log("Error" + err);
  }
});
