const jwt = require("jsonwebtoken");
const dbo = require("../db/conn");
module.exports = {
  authenticate,
  getAll,
  omitPassword,
};

async function authenticate({ email, password }) {
  const user = await dbo.getDB().collection("users").findOne({
    email: email,
    password: password,
  });

  if (!user) return null;

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT_TOKEN, {
    expiresIn: "7d",
  });
  // const decoded = jwt.verify(token, process.env.SECRET_JWT_TOKEN);
  return {
    ...omitPassword(user),
    token,
  };
}

async function getAll() {
  let db_connect = dbo.getDB();
  const users = await db_connect.collection("users").find().toArray();
  return users.map((u) => omitPassword(u));
}

// helper functions

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
