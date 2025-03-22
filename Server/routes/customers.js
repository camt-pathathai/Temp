const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

router.get('/customers', async (req, res) => {
    try {
      // Get all users (customers) including role and address
      const customers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,           // Include role
          address: true,        // Include address
          createdAt: true,
        },
      });
  
      // Render the customers page with the fetched data
      res.render('customers', { customers });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).send("Internal Server Error");
    }
});


module.exports = router;