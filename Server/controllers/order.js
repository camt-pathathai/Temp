const prisma = require('../config/prisma');

exports.getOrders = async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          orderedBy: true,
        },
      });
  
      const formattedOrders = orders.map(order => ({
        id: order.id,
        customer_name: order.orderedBy ? order.orderedBy.name : 'Unknown',
        date: order.createdAt.toLocaleDateString(),
        total: order.cartTotal ? order.cartTotal.toFixed(2) : '0.00', // Safely handle cartTotal
        status: order.orderStatus,
        cartTotal: order.cartTotal, // Ensure this is passed
        orderItems: order.orderItems,
        userId: order.orderedById, // Add the user ID here
      }));
      
      // Respective rendering of the orders in the view
      res.render('adminorders', { orders: formattedOrders });
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Server Error" });
    }
  };