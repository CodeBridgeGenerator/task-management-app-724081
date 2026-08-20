const assert = require("assert");
const app = require("../../src/app");

let usersRefData = [
  {
    name: "Standard User",
    email: "standard@example.com",
    password: "password",
  },
];

describe("taskComments service", async () => {
  let thisService;
  let taskCommentCreated;
  let usersServiceResults;
  let users;

  const projectsCreated = await app.service("projects").Model.create({"task":"parentObjectId","title":"new value","description":"new value","status":"new value","priority":"new value","project":"parentObjectId","name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.686Z"});
const tasksCreated = await app.service("tasks").Model.create({"task":"parentObjectId","title":"new value","description":"new value","status":"new value","priority":"new value","project":`${projectsCreated._id}`,"name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.689Z","assignee":"parentObjectId"});

  beforeEach(async () => {
    thisService = await app.service("taskComments");

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
    assert.ok(thisService, "Registered the service (taskComments)");
  });

  describe("#create", () => {
    const options = {"task":`${tasksCreated._id}`,"title":"new value","description":"new value","status":"new value","priority":"new value","project":`${projectsCreated._id}`,"name":"new value","members":"parentObjectId","dueDate":"2026-08-20T19:16:21.689Z","assignee":"parentObjectId","author":"parentObjectId","content":"new value"};

    beforeEach(async () => {
      taskCommentCreated = await thisService.Model.create({...options, ...users});
    });

    it("should create a new taskComment", () => {
      assert.strictEqual(taskCommentCreated.task.toString(), options.task.toString());
assert.strictEqual(taskCommentCreated.author.toString(), options.author.toString());
assert.strictEqual(taskCommentCreated.content, options.content);
    });
  });

  describe("#get", () => {
    it("should retrieve a taskComment by ID", async () => {
      const retrieved = await thisService.Model.findById(taskCommentCreated._id);
      assert.strictEqual(retrieved._id.toString(), taskCommentCreated._id.toString());
    });
  });

  describe("#update", () => {
    const options = {"task":`${tasksCreated._id}`,"author":`${usersCreated._id}`,"content":"updated value"};

    it("should update an existing taskComment ", async () => {
      const taskCommentUpdated = await thisService.Model.findByIdAndUpdate(
        taskCommentCreated._id, 
        options, 
        { new: true } // Ensure it returns the updated doc
      );
      assert.strictEqual(taskCommentUpdated.task.toString(), options.task.toString());
assert.strictEqual(taskCommentUpdated.author.toString(), options.author.toString());
assert.strictEqual(taskCommentUpdated.content, options.content);
    });
  });

  describe("#delete", async () => {
    it("should delete a taskComment", async () => {
      await app
        .service("users")
        .Model.findByIdAndDelete(usersServiceResults._id);

      await app.service("projects").Model.findByIdAndDelete(projectsCreated._id);
await app.service("tasks").Model.findByIdAndDelete(tasksCreated._id);;

      const taskCommentDeleted = await thisService.Model.findByIdAndDelete(taskCommentCreated._id);
      assert.strictEqual(taskCommentDeleted._id.toString(), taskCommentCreated._id.toString());
    });
  });
});