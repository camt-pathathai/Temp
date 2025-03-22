const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { getOrders } = require('../controllers/order');

// In your Express route (or any other server framework you're using)
router.get('/orders/:userId', async (req, res) => {
    const userId = req.params.userId; // Assuming you store the user ID in the session or token
    const parsedUserId = parseInt(userId);
    try {
        // Fetch all orders for the user, including the related order items and product details (with image)
        const orders = await prisma.order.findMany({
          where: { orderedById: parsedUserId }, // Filter orders by user ID
          include: {
            orderItems: {
              include: {
                product: {
                  include: {
                    image: true, // Assuming the 'images' field is where product images are stored
                  },
                },
              },
            },
          },
        });
    
        //res.send(userId);
    //res.json(orders);
    res.render('orders',{orders : orders}); // Send the orders as JSON to the frontend
      } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
      }
});
  
router.get('/orders', getOrders);
    
module.exports = router;