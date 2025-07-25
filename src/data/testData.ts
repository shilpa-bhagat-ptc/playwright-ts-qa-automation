import { TestDataGenerator } from "../utils/testDataGenerator";

export const testData = {
  validUser: {
    username: "sbhagat",
    password: "123",
  },
  adminUser: {
    username: TestDataGenerator.username(),
    password: TestDataGenerator.password(),
    role: "Admin",
  },
  qaUser: {
    username: TestDataGenerator.username(),
    password: TestDataGenerator.password(),
    role: "QA",
  },
  viewerUser: {
    username: TestDataGenerator.username(),
    password: TestDataGenerator.password(),
    role: "Viewer",
  },
};
