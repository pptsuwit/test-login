const express = require("express");
const authServices = require("../services/auth.service");
const userServices = require("../services/users.service");
const routes = express.Router();
const upload = require("../_helpers/upload");

routes.post("/login", login);
routes.post("/register", upload.single("avatar"), userServices.createUser);

routes.get("/users", getAllUser);
routes.get("/user", userServices.getUser);
routes.put("/user/update/", upload.single("file"), userServices.updateUser);
routes.delete("/user/:id", userServices.deleteUser);

routes.get("/image/:filename", userServices.getAvatar);

function getAllUser(req, res, next) {
  authServices
    .getAll()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
}
function login(req, res, next) {
  authServices
    .authenticate(req.body)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res
          .status(400)
          .send({ message: "Email or password is incorrect" });
      }
    })
    .catch(next);
}

module.exports = routes;
