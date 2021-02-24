# node-easy-crud

This package is ment to make creating CRUD application for your node express mongo environment easy. Light Weight with **Zero Dependency**

now build with **TypeScript** since version **1.0.4**

It will Create API endpoints for Adding, Reading, Updating, Deleting form given mongoDB collection. you just simply have to provide a mongoose model to the constructor. It also provides form structure for frontend so that one can create a edit or add action forms easliy

a basic React component pacakge [react-node-easy-crud](https://www.npmjs.com/package/react-node-easy-crud) is created to make quick curd UI for **node-easy-crud**.
\*I need help for creating a front end packages for Anguler, Vui, and React which will run greate with **node-easy-crud\***.

## Installation

`npm install node-easy-crud`

## Usage

you can simply create a crud api for mongoDB collection with following(Subject is mongoose model and router is express router):

```node
new CURD(Subject, router);
```

### Simple Example

```node
const CURD = require("node-easy-crud");
const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject"); //mongoose model

//to create CRUD routes for Subject model Simply use following code:
new CURD(Subject, router);

module.exports = router;
```

### above code will create following endpoints

#### Read

`GET <express-router-url>/<mongoose model name>`

in our example mongoose model name is Subject so read endpoint is:

`GET <express-router-url>/Subject`

---

#### Add

this endpoint will be provided form structure for add action form

`GET <express-router-url>/Subject/add-form`

---

#### Insert

this endpoint will be provided for inserting a new document, you should provide the data to be inserted as JSON in request body.

`POST <express-router-url>/Subject/insert`

---

#### Edit form structure

this endpoint will be provided form structure and values of document to be edited, takes id of the document to be edited as paramenter

`GET <express-router-url>/Subject/edit-form/:id`

---

#### Update

this endpoint will be provided for updating a document, you should provide the data to be updated as JSON in request body. Data must contain id of document to be updated

`POST <express-router-url>/Subject/update`

---

## Options

You can also pass options as object as 3rd argumnt to the constructor to customize

### Example with options

this example shows how to use options

```node
const CURD = require("node-easy-crud");
const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject"); //mongoose model
const User = require("../models/User");

//to create CRUD routes for User model Simply use following code:
new CURD(Subject, router, {
  fields: ["name", "sem", "creator", "date"], // only select given fields for all CRUD oprations
  ref: { creator: { model: User, field: "name" } }, //replace value of creator field with value on given field i.e "name" from refrenced model
  route: "Subject", //will change route from default value model name to given value
});
module.exports = router;
```

### Options Table

| name                 | default             | data type | description                                                                                                                                          |
| -------------------- | ------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| idField              | \_id                | string    | set id field name of the model                                                                                                                       |
| route                | modelname           | string    | set base route for crud endpoints                                                                                                                    |
| ref                  | null                | object    | set reference to another model and display field from another model in the place reference id. ex: ref :{ creator: { model: User, field: "name" } }, |
| unsetAdd             | false               | boolean   | set true to disable add on model                                                                                                                     |
| unsetEdit            | false               | boolean   | set true to disable edit on model                                                                                                                    |
| unsetDelete          | false               | boolean   | set true to disable delete on model                                                                                                                  |
| fields               | all fields in model | array     | use to select specific fields while reading ex:fields: ["name", "sem", "creator", "topics"]                                                          |
| addFields            | fields              | array     | use to select specific fields while inserting                                                                                                        |
| editFields           | fields              | array     | use to select specific fields while editing                                                                                                          |
| callbackBeforeRead   | Undefined           | function  | use to add callback function to call before reading                                                                                                  |
| callbackBeforeDelete | Undefined           | function  | use to add callback function to call before deleting                                                                                                 |
| callbackBeforeUpdate | Undefined           | function  | use to add callback function to call before updating                                                                                                 |
| callbackBeforeInsert | Undefined           | function  | use to add callback function to call before inserting                                                                                                |
| callbackAfterRead    | Undefined           | function  | use to add callback function to call after reading                                                                                                   |
| callbackAfterDelete  | Undefined           | function  | use to add callback function to call after deleting                                                                                                  |
| callbackAfterUpdate  | Undefined           | function  | use to add callback function to call after updating                                                                                                  |
| callbackAfterInsert  | Undefined           | function  | use to add callback function to call after inserting                                                                                                 |

## Callbacks

you can add callback functions after or before every CRUD opration, you can pass callback funtions in options while creating object.
example below show how to add call back funtions before and after read opration:

```node
const BeforeRead = () => {
  console.log("starting to read data");
};
const AfterRead = (data) => {
  console.log(data);
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  fields: ["name", "sem", "creator", "date"],
  ref: { creator: { model: User, field: "name" } },
  route: "Subject", //Default value model name
  callbackBeforeRead: BeforeRead,
  callbackAfterRead: AfterRead,
});
```

### callbackBeforeRead

you can pass a function in callbackBeforeRead. this function will run before reading the data. function you passed to callbackBeforeRead should not have any arguments required and does not need to return anything.

```node
const BeforeRead = () => {
  console.log("starting to read data");
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeRead: BeforeRead,
});
```

callbackBeforeRead does not need to return anything but however if you want to stop reading in callbackBeforeRead you can return a error message and then node-easy-crud will not read and return data

```node
const BeforeRead = () => {
  console.log("starting to read data");
  return { errorFromCallback: "you can not read this data" };
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeRead: BeforeRead,
});
```

if you return errorFromCallback in callbackBeforeRead node-easy-crud will not read data and return the error in responce as following:

```bash
{ error: errorFromCallback }
```

### callbackBeforeDelete

you can pass a function in callbackBeforeDelete. this function will run before deleting a document from collection. function you passed to callbackBeforeDelete will recive request body containing id of document to be delated and does need to return reqest body.

```node
const BeforeDelete = (body) => {
  console.log("deleting row with id:" + body.id);
  return body; //returning body is required
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeDelete: BeforeDelete,
});
```

### callbackBeforeUpdate

you can pass a function in callbackBeforeUpdate. this function will run before updating a document from collection. function you passed to callbackBeforeUpdate will recive request body containing document to be updated and does need to return reqest body.

```node
const BeforeUpdate = (body) => {
  console.log("updating row with id:" + body.id);
  body.name = body.name.toUpperCase(); //changing the name to uppercase just for example
  return body; //returning body is required
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeUpdate: BeforeUpdate,
});
```

### callbackBeforeInsert

you can pass a function in callbackBeforeInsert. this function will run before inserting a document to collection. function you passed to callbackBeforeInsert will recive request body containing document to be added and does need to return reqest body.

```node
const BeforeInsert = (body) => {
  console.log("inserting new row");
  body.name = body.name.toUpperCase(); //changing the name to uppercase just for example
  return body; //returning body is required
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeInsert: BeforeInsert,
});
```

### errorFromCallback

To stop insert,update or delete opration in before call back, add errorFromCallback to body object and return it. then node-easy-crud will not perfore opration and only send error in responce

```node
const BeforeDelete = (body) => {
  body.errorFromCallback = "you dont have permission to delete this object";
  return body;
};
//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeDelete: BeforeDelete,
});
```

### messageFromCallback

to add custome success message add messageFromCallback to body before returning it in any callbackBefore other than callbackBeforeRead.

```node
const BeforeDelete = (body) => {
  body.messageFromCallback = "Just Trashed subject with id:" + body.id;
  return body;
};
//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackBeforeDelete: BeforeDelete,
});
```

### callbackAfterRead

you can pass a function in callbackAfterRead. this function will run after reading the data. function you passed to callbackAfterRead will recive data read form the given collection.

```node
const AfterRead = (data) => {
  console.log(data);
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackAfterRead: AfterRead,
});
```

### callbackAfterDelete

you can pass a function in callbackAfterDelete. this function will run after deleting a document. function you passed to callbackAfterDelete will recive object return by mongoose after deleting the document.

```node
const AfterDelete = (deleted) => {
  console.log(deleted);
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackAfterDelete: AfterDelete,
});
```

### callbackAfterUpdate

you can pass a function in callbackAfterUpdate. this function will run after updating a document. function you passed to callbackAfterUpdate will recive updated document as a argument.

```node
const AfterUpdate = (updatedRow) => {
  console.log(updatedRow);
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackAfterUpdate: AfterUpdate,
});
```

### callbackAfterInsert

you can pass a function in callbackAfterInsert. this function will run after inserting new document. function you passed to callbackAfterInsert will recive new document as a argument.

```node
const AfterInsert = (newRow) => {
  console.log(newRow);
};

//New CRUD(Model,Router,Options)
new CURD(Subject, router, {
  callbackAfterInsert: AfterInsert,
});
```

## In case of any query or suggetions to improve this package contact me

_Email me: [shashank23padwal@live.com](mailto:shashank23padwal@live.com?subject=[NPM]%20Node-Easy-Crud%20contact)_

_linkedIn: [Shashank Padwal](https://www.linkedin.com/in/shashankpadwal/)_
