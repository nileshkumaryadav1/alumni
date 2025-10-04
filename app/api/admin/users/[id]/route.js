// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import Student from "@/models/Student";
import connectDB from "@/utils/db";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params; // Next.js passes dynamic route params here

    const studentData = await Student.findOne({ _id: id });

    if (!studentData) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student: studentData });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
