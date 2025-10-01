const mongoose = require("mongoose");

const Sponsor = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    website: { type: String, required: true },
    image: { type: String, required: true },
    message: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Sponsor || mongoose.model("Sponsor", Sponsor);
