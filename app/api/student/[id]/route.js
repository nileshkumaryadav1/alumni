// app/api/student/[id]/route.js
// import connectToDatabase from "@/lib/mongodb";
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

// DELETE /api/student/:id
export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting student:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
