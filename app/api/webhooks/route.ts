import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // User Created Event
    if (evt.type === 'user.created') {
      const user = evt.data;

      // Prepare data
      const primaryEmail = user.email_addresses[0]?.email_address;
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'No Name';

      // Save in db
      await db.user.create({
        data: {
          clerkId: user.id,
          email: primaryEmail,
          name: fullName,
        },
      });

      console.log(`User ${primaryEmail} created in Database!`);
    }

    // User Updated Event
    else if (evt.type === 'user.updated') {
      const user = evt.data;

      // Prepare data
      const primaryEmail = user.email_addresses[0]?.email_address;
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'No Name';

      // Save in db
      await db.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          email: primaryEmail,
          name: fullName,
        },
      });

      console.log(`User ${primaryEmail} updated!`);
    }

    // User Deleted Event
    else if (evt.type === 'user.deleted') {
      const { id } = evt.data;

      // Save in db
      await db.user.delete({
        where: {
          clerkId: id,
        },
      });

      console.log(`User ${id} deleted!`);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
