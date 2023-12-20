const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
});

// Virtual for developer's url.
DeveloperSchema.virtual("url").get(function () {
  return `/catalog/developer/${this._id}`;
});

// Export model
module.exports = mongoose.model("Developer", DeveloperSchema);
