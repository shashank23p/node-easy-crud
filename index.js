class NodeEasyCurd {
  //crearting global Variables and route for CRUD
  constructor(model, router, config = {}) {
    this.model = model;
    //setting options
    this.idField = config.idField ? config.idField : "_id"; //set primery key field
    this.baseURL = config.route ? "/" + config.route : "/" + model.modelName;
    this.ref = config.ref;
    this.fields = config.fields;
    this.editFields = config.editFields;
    this.addFields = config.addFields;
    this.add = config.unsetAdd ? false : true;
    this.edit = config.unsetEdit ? false : true;
    this.del = config.unsetDelete ? false : true;
    //before call backs
    this.callbackBeforeRead = config.callbackBeforeRead;
    this.callbackBeforeDelete = config.callbackBeforeDelete;
    this.callbackBeforeUpdate = config.callbackBeforeUpdate;
    this.callbackBeforeInsert = config.callbackBeforeInsert;
    //after call backs
    this.callbackAfterRead = config.callbackAfterRead;
    this.callbackAfterDelete = config.callbackAfterDelete;
    this.callbackAfterUpdate = config.callbackAfterUpdate;
    this.callbackAfterInsert = config.callbackAfterInsert;

    let populateArray = [];

    if (this.ref) {
      for (var key in this.ref) {
        if (this.ref.hasOwnProperty(key)) {
          populateArray.push({ path: key, select: this.ref[key].field });
        }
      }
    }
    this.populateArray = populateArray;
    //route to read data
    router.get(this.baseURL, async (req, res) => {
      try {
        //run before callback
        if (this.callbackBeforeRead) {
          this.callbackBeforeRead();
        }
        let tableData = await this.model
          .find()
          .select(this.fields)
          .populate(this.populateArray)
          .lean();
        if (this.ref) {
          for (let i = 0; i < tableData.length; i++) {
            for (var key in this.ref) {
              if (tableData[i][key])
                tableData[i][key] = tableData[i][key][this.ref[key].field]; //update vale of ref field
            }
          }
        }
        res.json({
          tableData: tableData,
          edit: this.edit,
          del: this.del,
          add: this.add,
          idField: this.idField,
          title: model.modelName,
        });
        if (this.callbackAfterRead) {
          this.callbackAfterRead(tableData);
        }
      } catch (error) {
        res.json({ error: error.message });
      }
    });

    if (this.edit) {
      // Route to get Structure for edit form
      router.get(this.baseURL + "/edit-form/:id", async (req, res) => {
        try {
          //function which returns edit form structure
          const editFormStrc = await this.createEditObject(
            req.params.id,
            config
          );
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          res.json({ formStrc: editFormStrc, id: req.params.id });
        } catch (error) {
          res.json({ error: error.message });
        }
      });

      // Route to update
      router.post(
        this.baseURL + "/update",
        this.parseBody,
        async (req, res) => {
          try {
            //run before callback
            if (this.callbackBeforeUpdate) {
              req.body = this.callbackBeforeUpdate(req.body);
              if (!req.body)
                return res.json({
                  error: "callbackBeforeUpdate must return a reqest body",
                });
              if (req.body.errorFromCallback)
                return res.json({ error: req.body.errorFromCallback });
            }
            const fields = this.editFields ? this.editFields : this.fields;
            const validate = await this.validateUpdate(fields, req.body);
            if (!validate.valid) return res.json({ error: validate.error });
            const updated = await this.model.findOneAndUpdate(
              { [this.idField]: req.body[this.idField] },
              {
                $set: req.body,
              },
              { new: true, useFindAndModify: false }
            );
            if (updated) {
              res.json({
                row: updated,
                message: req.body.messageFromCallback
                  ? req.body.messageFromCallback
                  : "Updated Successfully",
              });
              //run after callback
              if (this.callbackAfterUpdate) {
                this.callbackAfterUpdate(updated);
              }
            } else {
              res.json({ error: "Something went wrong, Try again" });
            }
          } catch (error) {
            res.json({ error: error.message });
          }
        }
      );
    }
    if (this.add) {
      // Route to get Structure for add form
      router.get(this.baseURL + "/add-form", async (req, res) => {
        try {
          const fields = this.addFields ? this.addFields : this.fields;
          let formStrc = await this.getFromStruc(fields);
          res.json({ formStrc: formStrc });
        } catch (error) {
          res.json({ error: error.message });
        }
      });

      // Route to insert
      router.post(
        this.baseURL + "/insert",
        this.parseBody,
        async (req, res) => {
          try {
            //run before callback
            if (this.callbackBeforeInsert) {
              req.body = this.callbackBeforeInsert(req.body);
              if (!req.body)
                return res.json({
                  error: "callbackBeforeInsert must return a reqest body",
                });
              if (req.body.errorFromCallback)
                return res.json({ error: req.body.errorFromCallback });
            }
            const fields = this.addFields ? this.addFields : this.fields;
            const validate = await this.validateUpdate(fields, req.body);
            if (!validate.valid) return res.json({ error: validate.error });
            const row = new this.model(req.body);
            const savedRow = await row.save();
            res.json({
              row: savedRow,
              message: req.body.messageFromCallback
                ? req.body.messageFromCallback
                : "New " + this.model.modelName + " added",
            });
            //run after callback
            if (this.callbackAfterInsert) {
              this.callbackAfterInsert(savedRow);
            }
          } catch (error) {
            res.json({ error: error.message });
          }
        }
      );
    }
    if (this.del) {
      // Route to delete
      router.post(
        this.baseURL + "/delete",
        this.parseBody,
        async (req, res) => {
          try {
            //run before callback
            if (this.callbackBeforeDelete) {
              req.body = this.callbackBeforeDelete(req.body);
              if (!req.body)
                return res.json({
                  error: "callbackBeforeDelete must return a reqest body",
                });
              if (req.body.errorFromCallback)
                return res.json({ error: req.body.errorFromCallback });
            }
            const deleted = await this.model.deleteOne({
              [this.idField]: req.body.id,
            });
            res.json({
              message: req.body.messageFromCallback
                ? req.body.messageFromCallback
                : "Deleted Successfully",
            });
            //run after callback
            if (this.callbackAfterDelete) {
              this.callbackAfterDelete(deleted);
            }
          } catch (error) {
            res.json({ error: error.message });
          }
        }
      );
    }
  }

  async validateUpdate(fields, data) {
    let formStrc = await this.getFromStruc(fields);
    for (let i = 0; i < formStrc.length; i++) {
      if (formStrc[i].required === true && !data[formStrc[i].name]) {
        return { valid: false, error: formStrc[i].name + " is Required " };
      }
    }

    return { valid: true };
  }

  //function to create edit form structure object
  //args id:Id of the document
  async createEditObject(id) {
    let data = await this.model.findOne({ [this.idField]: id }).lean();
    const fields = this.editFields ? this.editFields : this.fields;
    let editFormStrc = await this.getFromStruc(fields, data);

    editFormStrc = [
      {
        value: id,
        name: this.idField,
        tag: "input",
        type: "text",
        disabled: true,
        required: true,
      },
      ...editFormStrc,
    ];

    return editFormStrc;
  }

  async getFromStruc(fields, data = {}) {
    const schema = this.model.schema.paths; //all keys available in current docs schema
    let formStrc = [];
    //loop thorugh all keys in schema
    for (var key of Object.keys(schema)) {
      //only push to arrey if key is in given fields
      if (!fields || fields.includes(key)) {
        //_id is auto genrated to field so skiping it
        if (key === this.idField) continue;
        let tag = "input";
        let type = "text";
        if (schema[key].instance === "Number") type = "number";
        if (schema[key].instance === "Date") {
          type = "date";
          data[key] = this.convertDate(data[key]);
        }
        let struc = {
          value: data[key],
          name: key,
          tag: tag,
          type: type,
          required: schema[key].options.required,
        }; //Structure for current input

        //handling refrances
        if (this.ref[key]) {
          struc.tag = "select";
          let allValues = await this.ref[key].model
            .find({})
            .select({ [this.idField]: 1, [this.ref[key].field]: 1 });
          let options = [];
          allValues.forEach((row) => {
            options.push({
              value: row[this.idField],
              text: row[this.ref[key].field],
            });
          });
          struc.options = options;
        }
        formStrc.push(struc);
      }
    }
    return formStrc;
  }

  convertDate(d) {
    const date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  }

  //parseing body to avoid using Dependencies
  parseBody(req, res, next) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      req.body = JSON.parse(body);
      next();
    });
  }
}

module.exports = NodeEasyCurd;
