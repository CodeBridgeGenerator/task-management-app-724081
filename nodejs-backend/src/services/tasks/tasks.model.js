
    module.exports = function (app) {
        const modelName = "tasks";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            title: { type:  String , required: true, index: true, trim: true, comment: "Title, p, false, true, true, true, true, true, true, , , , ," },
description: { type:  String , trim: true, comment: "Description, inputTextarea, false, true, true, true, true, true, true, , , , ," },
status: { type:  String , required: true, index: true, trim: true, comment: "Status, dropdown, false, true, true, true, true, true, true, , , , ," },
priority: { type:  String , required: true, index: true, trim: true, comment: "Priority, dropdown, false, true, true, true, true, true, true, , , , ," },
project: { type: Schema.Types.ObjectId, ref: "projects", comment: "Project, dropdown, false, true, true, true, true, true, true, projects, projects, one-to-one, name," },
assignee: { type: Schema.Types.ObjectId, ref: "users", comment: "Assignee, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name," },
dueDate: { type: Date, comment: "Due Date, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };