import connectDB from "@/utils/db";
import Event from "@/models/Event";
import Sponsor from "@/models/Sponsor";
import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment";

// 📌 CONNECT TO DATABASE
connectDB();

// 📌 GET ALL DATA (Events, Sponsors)
export async function GET() {
  try {
    const events = await Event.find();
    const sponsors = await Sponsor.find();
    return NextResponse.json({ events, sponsors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// 📌 ADD NEW ITEM (Event, Sponsor)
export async function POST(req) {
  try {
    const { category, newItem } = await req.json();
    
    if (category === "events") {
      const event = new Event(newItem);
      await event.save();
    } else if (category === "sponsors") {
      const sponsor = new Sponsor(newItem);
      await sponsor.save();
    } else {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    return NextResponse.json({ message: `${category} added successfully!` }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add data" }, { status: 500 });
  }
}

// 📌 EDIT ITEM
export async function PUT(req) {
  try {
    const { category, id, updatedItem } = await req.json();

    let model;
    if (category === "events") model = Event;
    else if (category === "sponsors") model = Sponsor;
    else return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    await model.findByIdAndUpdate(id, updatedItem);
    return NextResponse.json({ message: `${category} updated successfully!` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

// 📌 DELETE ITEM
export async function DELETE(req) {
  try {
    const { category, id } = await req.json();

    let model;
    if (category === "events") model = Event;
    else if (category === "sponsors") model = Sponsor;
    else return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    await model.findByIdAndDelete(id);
    return NextResponse.json({ message: `${category} deleted successfully!` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
