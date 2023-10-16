const cartModel = require("../models/cart.model");

const GetCart = (req, res) => {
  const user_id = req.user_id;

  cartModel.GetCart(user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      cartModel.getTotalCart((errorTotal, resultTotal) => {
        if (errorTotal) {
          res.status(400).json({
            error: "An Unknown error",
          });
        } else {
          const totalCart = resultTotal[0].total;
          res.json({
            totalCart,
            data: result,
          });
        }
      });
    }
  });
};

const AddCart = (req, res) => {
  const user_id = req.user_id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  cartModel.AddCart(user_id, product_id, quantity, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "Add item to cart successful.",
      });
    }
  });
};

const DeleteCart = (req, res) => {
  const { cart_id } = req.params;
  if (!cart_id) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  cartModel.DeleteCart(cart_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "delete item in cart successful.",
      });
    }
  });
};
const DeleteCartByUserId = (req, res) => {
  const user_id = req.user_id;
  if (!user_id) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  cartModel.DeleteCartByUserId(user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "delete item by user id in cart successful.",
      });
    }
  });
};

const UpdateCart = (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;

  if (!cart_id && !quantity) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  cartModel.UpdateCart(quantity, cart_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "update quantity item in cart successful.",
      });
    }
  });
};

module.exports = {
  GetCart,
  AddCart,
  DeleteCart,
  DeleteCartByUserId,
  UpdateCart,
};
