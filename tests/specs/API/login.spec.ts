import { APIRequestContext, expect, test } from "@playwright/test";

test.describe("Login API Tests", () => {
  test("Successful login", async ({
    request,
  }: { request: APIRequestContext }, testInfo) => {
    testInfo.annotations.push({
      type: "feature",
      description: "Login API - Success",
    });
    const response = await request.post("/api/login", {
      form: {
        username: "sbhagat",
        password: "123",
      },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ success: true });
  });

  test("Failed login", async ({
    request,
  }: { request: APIRequestContext }, testInfo) => {
    testInfo.annotations.push({
      type: "feature",
      description: "Login API - Failure",
    });
    const response = await request.post("/api/login", {
      data: {
        username: "user",
        password: "wrongpass",
      },
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ success: false });
  });
});
