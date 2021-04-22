const jwt = require("express-jwt");
const jwt1 = require("jsonwebtoken");
const { secret } = require("../config.json");
const db = require("../helpers/db");
var express = require("express");

function authorize() {
  return [
    // authenticate JWT token and attach decoded token to request as req.user
    jwt({ secret, algorithms: ["HS256"] }),

    // attach full user record to request object
    async (req, res, next) => {
      // get user with id from token 'sub' (subject) property
      console.log(req);
      const user = await db.User.findByPk(req.user.sub);
      // console.log("user", user)
      // check user still exists
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // authorization successful
      req.user = user.get();
      next();
    },
  ];
}

function verifiedToken(req, res, next) {
  const token = localStorage.getItem("token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt1.verify(token, secret);
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
}

module.exports = { authorize, verifiedToken };
