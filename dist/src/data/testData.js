"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testData = void 0;
const testDataGenerator_1 = require("../utils/testDataGenerator");
exports.testData = {
    validUser: {
        username: "sbhagat",
        password: "123",
    },
    adminUser: {
        username: testDataGenerator_1.TestDataGenerator.username(),
        password: testDataGenerator_1.TestDataGenerator.password(),
        role: "Admin",
    },
    qaUser: {
        username: testDataGenerator_1.TestDataGenerator.username(),
        password: testDataGenerator_1.TestDataGenerator.password(),
        role: "QA",
    },
    viewerUser: {
        username: testDataGenerator_1.TestDataGenerator.username(),
        password: testDataGenerator_1.TestDataGenerator.password(),
        role: "Viewer",
    },
};
