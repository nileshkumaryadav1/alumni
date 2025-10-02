import { NextResponse } from "next/server";
import Connect from "@/models/Connect";
import Student from "@/models/Student";
import connectDB from "@/utils/db";

export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) return NextResponse.json({ error: "Both senderId and receiverId required" }, { status: 400 });
    if (senderId === receiverId) return NextResponse.json({ error: "Cannot connect with yourself" }, { status: 400 });

    const existing = await Connect.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      deletedAt: null,
    });

    if (existing) return NextResponse.json({ message: "Connection already exists", connection: existing }, { status: 200 });

    const pairKey = senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;
    const connection = await Connect.create({ senderId, receiverId, pairKey, status: "pending" });

    return NextResponse.json({ message: "Request sent", connection }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // Incoming requests
    const requests = await Connect.find({ receiverId: userId, status: "pending", deletedAt: null }).populate("senderId", "name batch year");

    // Outgoing requests
    const sent = await Connect.find({ senderId: userId, status: "pending", deletedAt: null }).populate("receiverId", "name batch year");

    // Friends
    const friends = await Connect.find({ $or: [{ senderId: userId }, { receiverId: userId }], status: "accepted", deletedAt: null }).populate("senderId receiverId", "name batch year");

    return NextResponse.json({
      incoming: requests.map(r => ({ id: r._id, user: r.senderId })),
      outgoing: sent.map(r => ({ id: r._id, user: r.receiverId })),
      friends: friends.map(f => {
        const other = f.senderId._id.toString() === userId ? f.receiverId : f.senderId;
        return { id: f._id, user: other };
      }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { connId, status } = await req.json();
    if (!connId || !["accepted", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const connection = await Connect.findById(connId);
    if (!connection) return NextResponse.json({ error: "Connection not found" }, { status: 404 });

    connection.status = status;
    await connection.save();

    return NextResponse.json({ message: `Connection ${status}`, connection });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const connId = searchParams.get("connId");
    if (!connId) return NextResponse.json({ error: "connId required" }, { status: 400 });

    const connection = await Connect.findById(connId);
    if (!connection) return NextResponse.json({ error: "Connection not found" }, { status: 404 });

    connection.deletedAt = new Date();
    await connection.save();

    return NextResponse.json({ message: "Connection removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
