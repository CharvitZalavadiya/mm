import express from 'express';

const router = express.Router();

// Sending friends request
router.post('/:id', async (req, res) => {
  const { fromUser, toUser } = req.body;
  console.log(`from user: ${fromUser} to user: ${toUser}`);
  // Add your implementation here
});

export default router;
