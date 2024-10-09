// const express = require("express");
// const app = express();
// const userModel = require("./usermodel");

// app.get("/", (req, res) => {
//   res.send("hey");
// });

// app.get("/create", async (req, res) => {
//   let createdUser = await userModel.create({
//     name: "ayushi",
//     userName: "ayushi",
//     email: "ayushidwivedi694@gmail.com",
//   });
//   res.send(createdUser);
// });

// app.get("/read", async (req, res) => {
//   let users = await userModel.find();
//   res.send(users);
// });

// app.get("/update", async (req, res) => {
//   let updatedUser = await userModel.findOneAndUpdate(
//     { userName: "ayush" },
//     { name: "Ayush Dwivedi" },
//     { new: true }
//   );
//   res.send(updatedUser);
// });

// app.get("/delete", async (req, res) => {
//   let users = await userModel.findOneAndDelete({ userName: "ayushi" });
//   res.send(users);
// });

// app.listen(3000, () => {
//   console.log("Listing to port");
// });

// --------------------------------------------------------------------------------------------------------------------------------------

const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/usermodel"); // Assuming userModel is a MongoDB schema

// Middleware to handle JSON and form data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images)

app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine

app.set("view engine", "ejs");

// Home route

app.get("/", (req, res) => {
  res.render("index"); // Renders the home page
});

// Create a new user (POST)

app.post("/create", async (req, res) => {
  let { name, email, image } = req.body;
  try {
    let createdUser = await userModel.create({
      name: name,
      email: email,
      image: image,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});

// Read all users (GET)

app.get("/read", async (req, res) => {
  try {
    let allUsers = await userModel.find(); // Fetch all users from the database
    res.render("read", { allUsers: allUsers });
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// Delete a user (Render the delete form)

app.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

// Update a user (Render the update form)

app.post("/edit/:id", async (req, res) => {
  let { name, email, image } = req.body;
  let id = req.params.id;
  try {
    let user = await userModel.findOneAndUpdate(
      { _id: id }, // Changed to _id
      { name: name, email: email, image: image },
      { new: true }
    );
    res.redirect("/read");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

app.get("/edit/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await userModel.findById(id); // Find user by ID
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("edit", { user: user }); // Render the 'edit' view with user data
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
