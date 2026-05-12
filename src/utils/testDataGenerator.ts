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

  static releaseTabs(): string[] {
    return [
      "Test Plan",
      "Production Plan",
      "Production Schedule",
      "Product Group",
      "CFT",
      "Execution Plan",
      "Weekly Note",
    ];
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
  static releaseTabSubOptions(): string[] {
    return [
      "Test Plan",
      "Production Plan",
      "Production Schedule",
      "Product Group",
      "CFT",
      "Execution Plan",
      "Weekly Note",
    ];
  }

  static reportSubTabs(): string[] {
    return [
      "Overall",
      "Build/Period",
      "Execution Report",
      "CFT Report",
      "TestCase Info",
      "SPR Report",
      "Weekly Report",
      "TimeReport",
      "Project ID/V1Epic",
      "ROI Report",
    ];
  }

  static adminSubTabs(): string[] {
    return [
      "Users",
      "Offices",
      "Configurations",
      "Languages",
      "Platforms",
      "Products",
      "Components",
      "Test Types",
      "CFT Report",
      "App Type",
      "Application",
      "Release",
      "Capacity",
      "Exe Type",
      "Test Plan Template",
    ];
  }

  static userSubTabs(): string[] {
    return [
      "My Tasks",
      "My SPRs",
      "My Weekly Goal",
      "Resource",
      "My Profile",
    ];
  }

  static executionSubTabs(): string[] {
    return [
      "List",
      "Weekly Goal",
      "Run",
      "Test Automation",
      "QALab",
      "Configurations",
      "Analysis",
      "Search",
    ];
  }

  // Returns Planning tab sub-options
  static planningTabSubOptions(): string[] {
    return [
      "Release",
      "Resource Capacity",
      "Analyze",
      "Select",
      "Advance Select",
      "Test Automation",
      "Drop",
      "Delegate",
      "Weekly Goal",
      "Assign",
      "Weekly Assign",
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

export const TestPlan_Header = [
  "Tasks",
  "Duration",
  "Planned Start Date",
  "Planned End Date",
  "Holidays",
];
