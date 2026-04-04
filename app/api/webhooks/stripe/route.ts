import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Req Body
  const body = await req.text();

  // Stripe Signature
  const signature = req.headers.get("Stripe-Signature") as string;

  // Get Type Event
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed.", (error as Error).message);
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  // Event Type - Completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        // Fetch Order
        const order = await db.order.findUnique({
          where: {
            id: orderId
          },
          include: {
            items: true
          }
        })

        if (!order) throw new Error("Order not found");

        await db.$transaction(async (prisma) => {
          // Update status order to PAID
          await prisma.order.update({
            where: { 
              id: order.id 
            },
            data: { 
              status: 'PAID',
            },
          });

          // Create DownloadVerifications
          const validItems = order.items.filter(item => item.productId !== null);

          if (validItems.length > 0) {
            // Map Structure Data
            const downloadVerificationsData = validItems.map((item) => ({
              userId: order.userId,
              productId: item.productId as string,
              orderId: order.id,
            }));

            // Save data in DB
            await prisma.downloadVerification.createMany({
              data: downloadVerificationsData,
            });
          }
        })
        
        console.log(`✅ ชำระเงินสำเร็จ! อัปเดตออเดอร์ ${order.id} เรียบร้อยแล้ว`);
      } catch (error) {
        console.error("❌ อัปเดตออเดอร์ไม่สำเร็จ:", error);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
