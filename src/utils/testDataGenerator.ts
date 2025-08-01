import { faker } from "@faker-js/faker";

export class TestDataGenerator {
  // Generates a random full name
  static fullName(): string {
    return faker.person.fullName();
  }

  // Generates a random email
  static email(): string {
    return faker.internet.email().toLowerCase();
  }

  // Generates a random username
  static username(): string {
    return faker.internet.username().toLowerCase();
  }

  // Generates a strong random password
  static password(length = 10): string {
    return faker.internet.password({ length, memorable: false });
  }
  static installationTips(): string[] {
    return [
      "The instruction to reload Windchill base data",
      "The script under Unix to decompress ZIP files",
      "The script under Windows to decompress ZIP files",
      "Where is the cache of Windchill & Tomcat ?",
      "How to recreate Windchill database schema",
    ];
  }
}

export const PRODUCTION_DASHBOARD_HEADERS = [
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
export const Translation_STATUS_OPTIONS = [
  "Plan",
  "Execution",
  "Delay",
  "Blocked",
  "Done",
];
