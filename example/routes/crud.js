const express = require("express");
const router = express.Router();
const CURD = require("node-easy-crud");
const Subject = require("../models/Subject");
const User = require("../models/User");

const BeforeDelete = (body) => {
  body.messageFromCallback = "Subject Deleted";
  return body;
};

const BeforeInsert = (body) => {
  body.name = body.name.toUpperCase();
  body.messageFromCallback = "this is message from callback";
  return body;
};

const BeforeUpdate = (body) => {
  body.name = body.name.toUpperCase();
  body.messageFromCallback = "Updated Successfully";
  return body;
};
//CRUD Constructer stucture
//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  fields: ["name", "sem", "creator", "date"],
  ref: { creator: { model: User, field: "name" } },
  route: "Subject", //Default value model name
  callbackBeforeDelete: BeforeDelete,
  callbackBeforeInsert: BeforeInsert,
  callbackBeforeUpdate: BeforeUpdate,
});

module.exports = router;
