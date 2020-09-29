# node-easy-crud

this package is ment to make creating CRUD application for your node express mongo environment easy.

It will Create API endpoints for Adding, Reading, Updating, Deleting form given mongoDB collection. you just simply have to provide a mongoose model to the constructor. Also provide a form structure for frontend so that one can create a edit or add action forms easliy


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

**above code will create following endpoints**
#### Read:
`GET <express-router-url>/<mongoose model name>`

in our example mongoose model name is Subject so read endpoint is:

`GET <express-router-url>/Subject`

---
#### Add:
this endpoint will be provided form structure for add action form

`GET <express-router-url>/Subject/add-form`

---
#### Insert:
this endpoint will be provided for inserting a new document, you should provide the data to be inserted as JSON in request body.

`POST <express-router-url>/Subject/insert`

---
#### Edit form structure:
this endpoint will be provided form structure and values of document to be edited, takes id of the document to be edited as paramenter

`GET <express-router-url>/Subject/edit-form/:id`

---
#### Update:
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

//to create CRUD routes for Subject model Simply use following code:
new CURD(Subject, router, {
  fields: ["name", "sem", "creator", "date"], // only select given fields for all CRUD oprations
  ref: { creator: { model: User, field: "name" } }, //replace value of creator field with value on given field i.e "name" from refrenced model
  route: "Subject", //will change route from default value model name to given value
});
module.exports = router;
```

### Options Table

| name        | default             | data type | description                                                                                                                                          |
|-------------|---------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| idField     | _id                 | string    | set id field name of the model                                                                                                                       |
| route       | modelname           | string    | set base route for crud endpoints                                                                                                                    |
| ref         | null                | object    | set reference to another model and display field from another model in the place reference id. ex: ref :{ creator: { model: User, field: "name" } }, |
| unsetAdd    | false               | boolean   | set true to disable add on model                                                                                                                     |
| unsetEdit   | false               | boolean   | set true to disable edit on model                                                                                                                    |
| unsetDelete | false               | boolean   | set true to disable delete on model                                                                                                                  |
| fields      | all fields in model | array     | use to select specific fields while reading ex:fields: ["name", "sem", "creator", "topics"]                                                          |
| addFields   | fields              | array     | use to select specific fields while inserting                                                                                                        |
| editFields  | fields              | array     | use to select specific fields while editing                                                                                                          |                                                                                                       |
