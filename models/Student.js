// models/Student.js
const mongoose = require("mongoose");

//new combined schema
const studentSchema = new mongoose.Schema(
  {
    // Basic
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, trim: true },

    // Fest Details
    festId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    role: { type: String, enum: ["student", "alumni"], required: true },

    // Academic (students)
    college: { type: String, trim: true },
    year: { type: String, trim: true },
    branch: { type: String, trim: true },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    // Alumni
    batch: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    company: { type: String, trim: true },
    linkedin: { type: String, trim: true },

    // Events Registered
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    // Events
    events: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        status: {
          type: String,
          enum: ["registered", "interested", "going"],
          default: "registered",
        },
      },
    ],

    // Payment (students)
    hasPaid: { type: Boolean, default: false },
    paymentId: { type: String, trim: true },
    amountPaid: { type: Number, default: 0 },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
