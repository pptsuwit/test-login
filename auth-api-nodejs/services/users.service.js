const dbo = require("../db/conn");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("bson");
const path = require("path");
const fs = require("fs");
module.exports = {
  getAvatar,
  createUser,
  updateUser,
  deleteUser,
  getUser,
};

async function getUser(req, res) {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(" ")[1],
      decoded;
    try {
      decoded = jwt.verify(authorization, process.env.SECRET_JWT_TOKEN);
      // console.log(`decoded is : ${JSON.stringify(decoded.id)}`);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
    const userId = { _id: ObjectId(decoded.id) };
    await dbo
      .getDB()
      .collection("users")
      .findOne(userId, function (err, response) {
        if (err) return res.status(400).send({ err });
        const resUser = {
          ...response,
          token: authorization,
        };
        return res.status(200).send(resUser);
      });
  }
}

function getAvatar(req, res) {
  res.sendFile(
    path.join(__dirname, "..", "public", "uploads", req.params.filename)
  );
}
function createUser(req, res, next) {
  const user = {
    fullname: req.body.fullname,
    password: req.body.password,
    avatar: req.file ? req.file.filename : null,
    telephone: req.body.telephone,
    email: req.body.email,
  };
  dbo
    .getDB()
    .collection("users")
    .insertOne(user, function (err) {
      if (err) return res.status(400).send({ err });
      res.status(200).send({ res });
    });
}
function updateUser(req, res) {
  let id = { _id: ObjectId(req.body.id) };

  const newValue = {
    $set: {
      fullname: req.body.fullname,
      telephone: req.body.telephone,
      email: req.body.email,
      avatar:
        req.file !== undefined
          ? req.file.filename
          : req.body.avatar
          ? req.body.avatar
          : null,
    },
  };
  const fileName =
    req.file !== undefined
      ? req.file.filename
      : req.body.avatar
      ? req.body.avatar
      : null;

  dbo
    .getDB()
    .collection("users")
    .updateOne(id, newValue, function (err, response) {
      if (err) return res.status(400).send({ err });

      if (fileName !== null && fileName !== req.body.avatar) {
        if (req.body.avatar) {
          const filePath = path.join(
            __dirname,
            "..",
            "public",
            "uploads",
            fileName
          );
          fs.stat(filePath, function (err) {
            if (err) {
              return console.error(err);
            }
            fs.unlink(filePath, function (err) {
              if (err) return console.log(err);
              console.log("remove old file");
            });
          });
        }
      }

      res.status(200).send({ response });
    });
}
async function deleteUser(req, res) {
  let id = { _id: ObjectId(req.params.id) };
  dbo
    .getDB()
    .collection("users")
    .findOneAndDelete(id, function (err, response) {
      if (err) return res.status(400).send({ err });
      console.log(res);
      console.log(response.value.avatar);
      const fileName = response.value.avatar || null;
      console.log(fileName);
      if (fileName) {
        const filePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          fileName
        );
        fs.stat(filePath, function (err) {
          if (err) {
            return console.error(err);
          }
          fs.unlink(filePath, function (err) {
            if (err) return console.log(err);
            console.log("file deleted successfully");
          });
        });
      }
      res.status(200).send({ response });
    });
}
