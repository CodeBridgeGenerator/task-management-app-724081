const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("taskReminders service", async () => {
  let thisService;
  let taskReminderCreated;
  let usersServiceResults;
  let users;

  const projectsCreated = await app.service("projects").Model.create({"task":"parentObjectId","title":"new value","description":"new value","status":"new value","priority":"new value","project":"parentObjectId","name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.820Z"});
const tasksCreated = await app.service("tasks").Model.create({"task":"parentObjectId","title":"new value","description":"new value","status":"new value","priority":"new value","project":`${projectsCreated._id}`,"name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.821Z","assignee":"parentObjectId"});

  beforeEach(async () => {
    thisService = await app.service("taskReminders");

    // Create users here
    usersServiceResults = await app.service("users").Model.create(usersRefData);
    users = {
      createdBy: usersServiceResults[0]._id,
      updatedBy: usersServiceResults[0]._id,
    };
  });

  after(async () => {
    if (usersServiceResults) {
      await Promise.all(
        usersServiceResults.map((i) =>
          app.service("users").Model.findByIdAndDelete(i._id)
        )
      );
    }
  });

  it("registered the service", () => {
    assert.ok(thisService, "Registered the service (taskReminders)");
  });

  describe("#create", () => {
    const options = {"task":`${tasksCreated._id}`,"title":"new value","description":"new value","status":"new value","priority":"new value","project":`${projectsCreated._id}`,"name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.821Z","assignee":"parentObjectId","remindAt":"2026-08-20T19:16:21.821Z","isSent":true};

    beforeEach(async () => {
      taskReminderCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new taskReminder", () => {
      assert.strictEqual(taskReminderCreated.task.toString(), options.task.toString());
assert.strictEqual(taskReminderCreated.remindAt.toISOString(), options.remindAt);
assert.strictEqual(taskReminderCreated.isSent, options.isSent);
assert.strictEqual(taskReminderCreated.isSent, options.isSent);
    });
  });

  describe("#get", () => {
    it("should retrieve a taskReminder by ID", async () => {
      const retrieved = await thisService.Model.findById(taskReminderCreated._id);
      assert.strictEqual(retrieved._id.toString(), taskReminderCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"task":`${tasksCreated._id}`,"remindAt":"2026-08-20T19:16:21.821Z","isSent":false};

    it("should update an existing taskReminder ", async () => {
      const taskReminderUpdated = await thisService.Model.findByIdAndUpdate(
        taskReminderCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(taskReminderUpdated.task.toString(), options.task.toString());
assert.strictEqual(taskReminderUpdated.remindAt.toISOString(), options.remindAt);
assert.strictEqual(taskReminderUpdated.isSent, options.isSent);
assert.strictEqual(taskReminderUpdated.isSent, options.isSent);
    });
  });

  describe("#delete", async () => {
    it("should delete a taskReminder", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("projects").Model.findByIdAndDelete(projectsCreated._id);
await app.service("tasks").Model.findByIdAndDelete(tasksCreated._id);;

      const taskReminderDeleted = await thisService.Model.findByIdAndDelete(taskReminderCreated._id);
      assert.strictEqual(taskReminderDeleted._id.toString(), taskReminderCreated._id.toString());
    });
  });
});