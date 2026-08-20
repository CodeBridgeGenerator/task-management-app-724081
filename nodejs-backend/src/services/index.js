const projects = require("./projects/projects.service.js");
const tasks = require("./tasks/tasks.service.js");
const taskComments = require("./taskComments/taskComments.service.js");
const taskReminders = require("./taskReminders/taskReminders.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(projects);
  app.configure(tasks);
  app.configure(taskComments);
  app.configure(taskReminders);
    // ~cb-add-configure-service-name~
};
