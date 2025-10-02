import mongoose from "mongoose";

const ConnectSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    deletedAt: { type: Date, default: null },
    pairKey: { type: String, required: true },
  },
  { timestamps: true }
);

// Generate consistent pairKey
ConnectSchema.pre("save", function (next) {
  const sender = this.senderId.toString();
  const receiver = this.receiverId.toString();
  this.pairKey = sender < receiver ? `${sender}_${receiver}` : `${receiver}_${sender}`;
  next();
});

// Unique pairKey (only active connections)
ConnectSchema.index({ pairKey: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

// Clean output
ConnectSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.pairKey;
    return ret;
  },
});

export default mongoose.models.Connect || mongoose.model("Connect", ConnectSchema);
