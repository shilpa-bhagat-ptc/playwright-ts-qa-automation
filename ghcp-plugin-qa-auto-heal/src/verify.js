// Thin re-export so callers (tests, alternate handlers) can import without
// pulling the whole SDK surface. The SDK does the actual crypto.
export { verifyAndParseRequest } from "@copilot-extensions/preview-sdk";
