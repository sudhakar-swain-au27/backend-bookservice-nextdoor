export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required' });

    // Mock order creation (replace with real gateway integration)
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const order = {
      id: orderId,
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const paymentWebhook = async (req, res) => {
  // In production, verify signature from payment gateway
  console.log('Payment webhook received:', req.body);
  // Process webhook (update bookings, mark payment paid, etc.)
  res.status(200).json({ success: true });
};
