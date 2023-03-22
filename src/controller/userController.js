const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { validateMongoDbId } = require("../utils/validateMongodbID");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require('../models/orderModel')
const userModel = require("../models/userModel");
const crypto = require("crypto");
const { sendEmail } = require("./emailController");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // Create new user if not exists
    const newUser = await User.create(req.body);
    console.log("no existe el usuario");
    res.json(newUser);
  } else {
    // User already exists
    throw new Error("User Already exists");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser.id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({ findUser, token: generateToken(findUser?._id) });
  } else {
    throw new Error("Invalid Credentials ");
  }
});

// Get all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find({});
    res.json(getUsers);
  } catch (err) {
    throw new Error(err);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await User.findById(id);
    res.json(getUser);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (err) {
    throw new Error(err);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({
      message: "User blocked",
    });
  } catch (err) {
    throw new Error(err);
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error(`Not Authorized`);
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin.id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({ findAdmin, token: generateToken(findAdmin?._id) });
  } else {
    throw new Error("Invalid Credentials ");
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log("[Cookie ]", cookie);
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present in db or not matched");
  jwt.verify(refreshToken, "mysign", (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie) throw new Error("No Refresh token in Cookies");
  const refreshToken = cookie.refresToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});
const unlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      message: "User unlock",
    });
  } catch (err) {
    throw new Error(err);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await userModel.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await userModel.findOne({ email });
  if (!findUser) throw new Error("User not found with this email");
  try {
    const token = await findUser.createPasswordResetToken();
    console.log(token);
    await findUser.save();
    const resetUrl = `Hi, please follow this link to reset Your password. This link i valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}>Click here</a>`;
    const data = {
      to: email,
      subject: "Forgor Password Link",
      text: "Hey User",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (err) {
    throw new Error(err);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const hashedTken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedTken);
    const user = await userModel.findOne({
      passwordResetToken: hashedTken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Token Expired, Please try again!");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

// save user addres
const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});
const getWishlith = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const findUser = await User.findById(_id).populate("wishlisht");
    res.json(findUser);
  } catch (err) {
    throw new Error(err);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    // Sumamos el precio por la cantidad de productos que vamos a comprar
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user._id,
    }).save();
    res.json(newCart);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({
      orderby: _id,
    }).populate("products.product");
    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });

    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  console.log(validCoupon);
  if (!validCoupon) throw new Error(`Invalid Coupon`);
  const user = await User.findOne({ _id });
  let { products, cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate({
    orderby: user._id
  }, {
    totalAfterDiscount
  }, {
    new:true
  })
  res.json(totalAfterDiscount);
});
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied} = req.body;
  try {
    if (!COD) throw new Error(`Create cash order failed`);
    const user = await User.findById(_id);
    let userCart = Cart.findOne({
      orderby: user._id
    })
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
   
  } catch(err) {
    throw new Erro(err)
  }
})
module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  resetPassword,
  forgotPasswordToken,
  loginAdmin,
  getWishlith,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
};
