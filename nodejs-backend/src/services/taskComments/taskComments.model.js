
    module.exports = function (app) {
        const modelName = "taskComments";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            task: { type: Schema.Types.ObjectId, ref: "tasks", comment: "Task, dropdown, false, true, true, true, true, true, true, tasks, tasks, one-to-one, title," },
author: { type: Schema.Types.ObjectId, ref: "users", comment: "Author, dropdown, false, true, true, true, true, true, true, users, users, one-to-one, name," },
content: { type:  String , required: true, trim: true, comment: "Comment, inputTextarea, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };