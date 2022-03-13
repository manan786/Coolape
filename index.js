const express = require("express");
var cors = require("cors");

require("dotenv").config();
const app = express();
const MongoClient = require("mongodb").MongoClient;
let port = process.env.PORT || 3000;
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
const URL =
  "mongodb+srv://abdul:abdulmanan@cluster0.995t1.mongodb.net/demo?retryWrites=true&w=majority";
// const URL = "mongodb://127.0.0.1:27017";
MongoClient.connect(
  URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (!err) {
      const database = client.db("demo");
      const clientsCollection = database.collection("user");

      var myLogger = (req, res, next) => {
        if (req.params.id == process.env.Unique_key) {
          next();
        } else {
          res.status(400).send({ Value: "Unauthorized User" });
        }
      };
      app.get("/", (req, res) => {
        res.send("Hello World !");
      });
      // add user
      app.post("/adduser/:id", myLogger, (req, res) => {
        clientsCollection
          .find()
          .toArray()
          .then((results) => {
            const result = results.filter(
              (word) => word.address === req.body.address
            );
            if (result.length !== 0) {
              res.status(200).send({
                value: "Address Already Exist!",
              });
              return;
            }
            clientsCollection
              .insertOne(req.body)
              .then((result) => {
                res.send(result);
              })
              .catch((error) => {
                console.error(error);
                res.send("0");
              });
          });
      });
      // show user
      app.get("/users/:id", myLogger, (req, res) => {
        clientsCollection
          .find()
          .toArray()
          .then((results) => {
            res.status(200).send(results);
            //      consts
          })
          .catch((error) => console.error(error));
      });
    } else {
      console.log("object");
      console.log("DataBase Not Connected: ", err);
    }
  }
);
app.listen(port, function () {
  console.log(`listening on ${port}`);
});
