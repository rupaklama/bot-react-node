const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
  course: {
    type: String,
    trim: true,
  },
  counter: {
    type: Number,
    default: 1,
  },
});

const Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
