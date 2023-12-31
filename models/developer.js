const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  year_established: {
    type: String,
    maxLength: 4,
  },
  founders: {
    type: String,
    maxLength: 500,
  },
  description: {
    type: String,
    maxLength: 500,
  },
  site: {
    type: String,
  },
});

// Virtual for developer's url.
DeveloperSchema.virtual("url").get(function () {
  return `/inventory/developer/${this._id}`;
});

// Export model
module.exports = mongoose.model("Developer", DeveloperSchema);
