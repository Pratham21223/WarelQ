const { Webhook } = require('svix');
const User = require('../models/User');

const handleClerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Get Svix headers for verification
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // Check if headers exist
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  // Get the raw body (as string)
  const payload = req.body.toString();

  // Create Svix webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the webhook signature
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).json({ 
      success: false,
      error: 'Webhook verification failed' 
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log(`📥 Webhook received: ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Handler functions
async function handleUserCreated(data) {
  const { id, email_addresses, first_name, last_name, username, profile_image_url } = data;

  const user = await User.create({
    clerk_user_id: id,
    email: email_addresses[0]?.email_address,
    first_name: first_name || null,
    last_name: last_name || null,
    username: username || null,
    profile_image_url: profile_image_url || null
  });

  console.log(`✅ User created in database: ${user.id}`);
  return user;
}

async function handleUserUpdated(data) {
  const { id, email_addresses, first_name, last_name, username, profile_image_url } = data;

  const user = await User.update(id, {
    email: email_addresses[0]?.email_address,
    first_name: first_name || null,
    last_name: last_name || null,
    username: username || null,
    profile_image_url: profile_image_url || null
  });

  console.log(`✅ User updated in database: ${user?.id}`);
  return user;
}

async function handleUserDeleted(data) {
  const { id } = data;

  const user = await User.delete(id);
  console.log(`✅ User deleted from database: ${user?.id}`);
  return user;
}

module.exports = {
  handleClerkWebhook
};
