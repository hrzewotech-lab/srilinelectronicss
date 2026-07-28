const mongoose = require("mongoose");

const FAQ_CATEGORIES = [
  "About Srilin",
  "Embedded Hardware Design Services",
  "ECAD Layout Services",
  "Embedded Software Development Services",
  "Component Sourcing Services",
  "Stencil Manufacturing Services",
  "PCB Manufacturing",
  "PCB Assembly",
  "X-Ray Inspection",
  "Testing Services",
  "Conformal Coating",
  "Turnkey Box Build Integration",
  "Ball Grid Array",
  "Laser Marking/ Laser Printing",
  "General",
];

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: false,
    },
    category: {
      type: String,
      enum: FAQ_CATEGORIES,
      default: "General",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", faqSchema);
module.exports.FAQ_CATEGORIES = FAQ_CATEGORIES;
