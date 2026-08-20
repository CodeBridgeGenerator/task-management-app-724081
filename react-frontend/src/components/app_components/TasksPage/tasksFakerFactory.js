
import { faker } from "@faker-js/faker";
export default (user,count,projectIds,assigneeIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
title: faker.lorem.sentence(""),
description: faker.lorem.sentence(""),
status: faker.lorem.sentence(""),
priority: faker.lorem.sentence(""),
project: projectIds[i % projectIds.length],
assignee: assigneeIds[i % assigneeIds.length],
dueDate: faker.date.recent(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
