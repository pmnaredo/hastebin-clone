const express = require("express");
const mongoose = require("mongoose");
const Document = require("./models/Document");

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then((result) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const welcome = `Welcome to WasteBin!

Use the commands in the top right corner
to create a new file to share with others.`;

app.get("/", (req, res) => {
  res.render("code-display", { code: welcome, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    // fix this: show some flash message
    res.render("new", { value });
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("new", { value: document.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    // console.log(document.value);
    res.render("code-display", { code: document.value, id });
  } catch (e) {
    res.redirect("/");
  }
});

app.get("/:id/duplicate");

app.listen(process.env.port || 3000);
