const prisma = require("../config/prisma");

exports.dashboardStats = async (req, res) => {
    try {
        // 1. Fetch monthly sales (sum of prices in ProductOnOrder for the current month)
        const monthlySales = await prisma.productOnOrder.aggregate({
          _sum: {
            price: true,
          },
          where: {
            order: {
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of the current month
              },
            },
          },
        });
    
        // 2. Fetch total products
        const totalProducts = await prisma.product.count();
    
        // 3. Fetch total users
        const totalUsers = await prisma.user.count();
    
        // 4. Fetch total orders
        const totalOrders = await prisma.order.count();
    
        // 5. Render the dashboard with stats
        res.render('dashboard', {
          monthlySales: monthlySales._sum.price || 0,
          totalProducts,
          totalUsers,
          totalOrders,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Server Error" });
      }
    };
