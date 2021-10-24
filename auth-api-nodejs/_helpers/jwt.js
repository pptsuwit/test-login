const expressJwt = require("express-jwt");
const pathToRegexp = require("path-to-regexp");
module.exports = jwt;

function jwt() {
  const secret = process.env.SECRET_JWT_TOKEN;
  // const unprotected = [pathToRegexp("/api/image*"), pathToRegexp("/favicon.ico")];
  return expressJwt({ secret: secret, algorithms: ["HS256"] }).unless({
    path: [
      // public routes that don't require authentication
      "/api/login",
      "/api/register",
      pathToRegexp("/api/image*"),
    ],
  });
}
