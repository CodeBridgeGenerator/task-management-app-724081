const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("tasks service", async () => {
  let thisService;
  let taskCreated;
  let usersServiceResults;
  let users;

  const projectsCreated = await app.service("projects").Model.create({"title":"new value","description":"new value","status":"new value","priority":"new value","project":"parentObjectId","name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.530Z"});

  beforeEach(async () => {
    thisService = await app.service("tasks");

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
    assert.ok(thisService, "Registered the service (tasks)");
  });

  describe("#create", () => {
    const options = {"title":"new value","description":"new value","status":"new value","priority":"new value","project":`${projectsCreated._id}`,"name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.530Z","assignee":"parentObjectId"};

    beforeEach(async () => {
      taskCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new task", () => {
      assert.strictEqual(taskCreated.title, options.title);
assert.strictEqual(taskCreated.description, options.description);
assert.strictEqual(taskCreated.status, options.status);
assert.strictEqual(taskCreated.priority, options.priority);
assert.strictEqual(taskCreated.project.toString(), options.project.toString());
assert.strictEqual(taskCreated.assignee.toString(), options.assignee.toString());
assert.strictEqual(taskCreated.dueDate.toISOString(), options.dueDate);
    });
  });

  describe("#get", () => {
    it("should retrieve a task by ID", async () => {
      const retrieved = await thisService.Model.findById(taskCreated._id);
      assert.strictEqual(retrieved._id.toString(), taskCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"title":"updated value","description":"updated value","status":"updated value","priority":"updated value","project":`${projectsCreated._id}`,"assignee":`${usersCreated._id}`,"dueDate":"2026-08-20T19:16:21.530Z"};

    it("should update an existing task ", async () => {
      const taskUpdated = await thisService.Model.findByIdAndUpdate(
        taskCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(taskUpdated.title, options.title);
assert.strictEqual(taskUpdated.description, options.description);
assert.strictEqual(taskUpdated.status, options.status);
assert.strictEqual(taskUpdated.priority, options.priority);
assert.strictEqual(taskUpdated.project.toString(), options.project.toString());
assert.strictEqual(taskUpdated.assignee.toString(), options.assignee.toString());
assert.strictEqual(taskUpdated.dueDate.toISOString(), options.dueDate);
    });
  });

  describe("#delete", async () => {
    it("should delete a task", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("projects").Model.findByIdAndDelete(projectsCreated._id);;

      const taskDeleted = await thisService.Model.findByIdAndDelete(taskCreated._id);
      assert.strictEqual(taskDeleted._id.toString(), taskCreated._id.toString());
    });
  });
});