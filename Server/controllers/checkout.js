
const prisma = require('../config/prisma');

exports.add = async (req, res) => {
  const userId = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token
  const parsedUserId = parseInt(userId);
  const { address } = req.body;

  if (!userId) {
      return res.status(401).json({ message: 'User not logged in' });
  }

  // 1. Find the user by userId
  const user = await prisma.user.findUnique({ where: { id: parsedUserId } });

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }

  // 2. Update the user's address in the database (if provided)
  const updatedUser = await prisma.user.update({
      where: { id: parsedUserId },
      data: {
          address: address, // Store the address provided during checkout
      },
  });

  if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid User ID" });
  }

  // Step 1: Get the user's cart items
  const cart = await prisma.cart.findFirst({
      where: { orderedById: parsedUserId }, // Assuming 'orderedById' is the field that relates to the user
      include: {
          ProductOnCart: {
              include: {
                  product: true, // Fetch the associated product for each ProductOnCart
              },
          },
      },
  });

  if (!cart || cart.ProductOnCart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty!' });
  }

  const order = await prisma.order.create({
      data: {
          orderedById: parsedUserId, // Link to the user
          cartTotal: cart.cartTotal,
          orderStatus: 'Pending', // Order status
      },
  });

  // Step 3: Move products from the cart to the order
  const orderItems = cart.ProductOnCart.map(item => ({
      orderId: order.id,
      productId: item.productId,
      count: item.count,
      price: item.price,
  }));

  // Insert the order items
  await prisma.productOnOrder.createMany({
      data: orderItems,
  });

  // Step 4: Update product stock and sold count
  for (const item of cart.ProductOnCart) {
      const productId = item.productId;
      const quantity = item.count;

      // Decrease the quantity of the product in stock
      await prisma.product.update({
          where: { id: productId },
          data: {
              quantity: { decrement: quantity }, // Decrease the product's quantity
              sold: { increment: quantity }, // Increase the product's sold count
          },
      });
  }

  // Step 5: Clear the user's cart
  await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id }, // Delete all items in the cart
  });

  // Step 6: Send response with order details
  res.status(200).json({ message: 'Order placed successfully!', order });
};


  exports.list = async (req,res) => {
    
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
            res.render("checkout", { cartItems: cart ? cart.ProductOnCart : [] });
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch cart items" });
        }
};
