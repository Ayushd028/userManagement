const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost:27017/mern-crud`);

const userSchema = mongoose.Schema({
  name: "string",
  email: "string",
  image: "string",
});

module.exports = mongoose.model("user", userSchema);
