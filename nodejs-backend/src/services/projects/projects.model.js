
    module.exports = function (app) {
        const modelName = "projects";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type:  String , required: true, index: true, trim: true, comment: "Name, p, false, true, true, true, true, true, true, , , , ," },
description: { type:  String , trim: true, comment: "Description, inputTextarea, false, true, true, true, true, true, true, , , , ," },
status: { type:  String , required: true, index: true, trim: true, comment: "Status, dropdown, false, true, true, true, true, true, true, , , , ," },
members: { type: [Schema.Types.ObjectId], ref: "users", description: "isArray", comment: "Members, dropdown, false, true, true, true, true, true, true, users, users, one-to-many, name," },
dueDate: { type: Date, comment: "Due Date, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };