"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation_STATUS_OPTIONS = exports.PRODUCTION_DASHBOARD_HEADERS = exports.TestDataGenerator = void 0;
const faker_1 = require("@faker-js/faker");
class TestDataGenerator {
    // Generates a random full name
    static fullName() {
        return faker_1.faker.person.fullName();
    }
    // Generates a random email
    static email() {
        return faker_1.faker.internet.email().toLowerCase();
    }
    // Generates a random username
    static username() {
        return faker_1.faker.internet.username().toLowerCase();
    }
    // Generates a strong random password
    static password(length = 10) {
        return faker_1.faker.internet.password({ length, memorable: false });
    }
    static installationTips() {
        return [
            "The instruction to reload Windchill base data",
            "The script under Unix to decompress ZIP files",
            "The script under Windows to decompress ZIP files",
            "Where is the cache of Windchill & Tomcat ?",
            "How to recreate Windchill database schema",
        ];
    }
}
exports.TestDataGenerator = TestDataGenerator;
exports.PRODUCTION_DASHBOARD_HEADERS = [
    "Release",
    "Project Manager",
    "Batch",
    "Start Date",
    "End Date",
    "Total Volume",
    "Daily Capacity",
    "Total Working Days",
    "Total Required Engineers",
    "Total Done",
    "Coverage %",
    "Translation Status",
    "Production Status",
    "Testing Status",
];
exports.Translation_STATUS_OPTIONS = [
    "Plan",
    "Execution",
    "Delay",
    "Blocked",
    "Done",
];
