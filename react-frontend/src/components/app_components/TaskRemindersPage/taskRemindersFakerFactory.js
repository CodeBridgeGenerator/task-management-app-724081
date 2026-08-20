
import { faker } from "@faker-js/faker";
export default (user,count,taskIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
task: taskIds[i % taskIds.length],
remindAt: faker.date.recent(""),
isSent: faker.datatype.boolean(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
