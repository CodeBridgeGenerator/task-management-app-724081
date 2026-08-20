
    module.exports = function (app) {
        const modelName = "taskReminders";
        const mongooseClient = app.get("mongooseClient");
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            task: { type: Schema.Types.ObjectId, ref: "tasks", comment: "Task, dropdown, false, true, true, true, true, true, true, tasks, tasks, one-to-one, title," },
remindAt: { type: Date, required: true, comment: "Remind At, p, false, true, true, true, true, true, true, , , , ," },
isSent: { type: Boolean, required: true, comment: "Sent, p, false, true, true, true, true, true, true, , , , ," },

            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: false },
          }, { timestamps: true });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };