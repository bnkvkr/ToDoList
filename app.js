//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//db
mongoose
  .connect("mongodb+srv://bnkvkr:vishalku1@@cluster0.qaltp.mongodb.net/todolist", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection Established");
  })
  .catch((e) => {
    console.log("No Connection");
  });

///schema
const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Vishal",
});

const item2 = new Item({
  name: "Saurav",
});
const defaultItems = [item1, item2];

app.get("/", function (req, res) {
  Item.find({}, (err, result) => {
    // if (result.length == 0) {
    //   Item.insertMany(defaultItems, (err) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.group("Successfully Saved");
    //     }
    //   });
    //   res.redirect("/");
    // } else {
    // }
    res.render("list", { listTitle: "To Do List", newListItems: result });
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  if(itemName=="")
  {
    res.redirect("/");
  }
  else
  {

    const item = new Item({
      name: itemName,
    });
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.body.checkbox);
    console.log("Successfully Deleted");
    console.log(deleted);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
});

app.listen(port, function () {
  
  console.log("Server started on port 3000");
});
