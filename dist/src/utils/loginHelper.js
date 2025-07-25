"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const users_json_1 = __importDefault(require("../data/users.json"));
async function login(page) {
    await page.goto("http://lqatms-test3.ptcnet.ptc.com:8080/QALink/jsp/home/");
    await page.fill("#username", users_json_1.default.validUser.username);
    await page.fill("#password", users_json_1.default.validUser.password);
    await page.click("#loginButton");
    // await page.waitForURL("**/home"); // wait until navigation completes
}
