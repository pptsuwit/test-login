const dbo = require("../db/conn");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("bson");
const path = require("path");
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
  dbo
    .getDB()
    .collection("users")
    .updateOne(id, newValue, function (err, response) {
      if (err) return res.status(400).send({ err });
      res.status(200).send({ response });
    });
}
function deleteUser(req, res) {
  let id = { _id: ObjectId(req.params.id) };
  dbo
    .getDB()
    .collection("users")
    .deleteOne(id, function (err, response) {
      if (err) return res.status(400).send({ err });
      if (res.deleteCount == 0) {
        res.status(400).send({ message: "User Not found" });
      }
      res.status(200).send({ response });
    });
}
