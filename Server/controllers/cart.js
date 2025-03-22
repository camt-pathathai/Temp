const prisma = require('../config/prisma');

exports.cart = async (req, res) => {
  try {
      // Extract userId from the URL parameters
      const { userId } = req.params; // userId is now in req.params

      if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
      }

      // Ensure userId is a valid number
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
          return res.status(400).json({ error: "Invalid User ID" });
      }

      const cart = await prisma.cart.findFirst({
          where: { orderedById: parsedUserId },
          include: {
              ProductOnCart: {
                  include: { product: { include: { image: true } } }
              }
          }
      });

      // Send the cart data back as a response
      //res.json({ cartItems: cart ? cart.ProductOnCart : [] });
      res.render("basket", { cartItems: cart ? cart.ProductOnCart : [] });
  } catch (err) {
      res.status(500).json({ error: "Failed to fetch cart items" });
  }
};



exports.cartupdate = async (req, res) => {
  const { productId } = req.params;
  const { count } = req.body;
  const userId = req.headers.authorization?.replace('Bearer ', ''); // Extract userId

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  if (count < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  try {
    // Get the user's cart ID
    const userCart = await prisma.cart.findFirst({
      where: { orderedById: parseInt(userId) },
    });

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Update the cart item count
    await prisma.productOnCart.updateMany({
      where: {
        cartId: userCart.id,
        productId: parseInt(productId),
      },
      data: { count: parseInt(count) },
    });

    // Recalculate the cart total
    const cartItems = await prisma.productOnCart.findMany({
      where: { cartId: userCart.id },
      include: { product: true },
    });

    const cartTotal = cartItems.reduce((total, item) => {
      return total + item.count * item.product.price;
    }, 0);

    // Update cartTotal in the database
    await prisma.cart.update({
      where: { id: userCart.id },
      data: { cartTotal },
    });

    // Retrieve updated cart with correct total
    const updatedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        ProductOnCart: { include: { product: { include: { image: true } } } },
      },
    });

    res.json({ cartTotal, cartItems: updatedCart?.ProductOnCart || [] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};




exports.addcart = async (req, res) => {
  try {
    const { userId, productId, count, price } = req.body; // Get userId from request body
    
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }

    // Ensure userId is treated as an integer
    const userIdInt = parseInt(userId);

    if (isNaN(userIdInt)) {
        return res.status(400).json({ msg: "Invalid User ID" });
    }

    let cart = await prisma.cart.findFirst({
        where: { orderedById: userIdInt }, // Use userIdInt here instead of userId
        include: { ProductOnCart: true }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { orderedById: userIdInt, cartTotal: 0 }
        });
    }

    const existingCartItem = await prisma.productOnCart.findFirst({
        where: { cartId: cart.id, productId: parseInt(productId) }
    });

    if (existingCartItem) {
        await prisma.productOnCart.update({
            where: { id: existingCartItem.id },
            data: {
                count: existingCartItem.count + parseInt(count),
                price: existingCartItem.price + parseFloat(price) * parseInt(count)
            }
        });
    } else {
        await prisma.productOnCart.create({
            data: {
                cartId: cart.id,
                productId: parseInt(productId),
                count: parseInt(count),
                price: parseFloat(price) * parseInt(count)
            }
        });
    }

    const cartItems = await prisma.productOnCart.findMany({ where: { cartId: cart.id } });

    const newCartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    await prisma.cart.update({
        where: { id: cart.id },
        data: { cartTotal: newCartTotal }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};


exports.remove = async (req, res) => {
  const { productId } = req.params; // Get product ID from the URL
  const userId = req.headers.authorization?.replace('Bearer ', ''); // Extract userId from headers

  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
  }

  try {
    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { orderedById: parseInt(userId) },
      select: { id: true }, // Only select cart ID
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
      },
    });

    res.redirect(`/cart/${userId}`);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart." });
  }
};
