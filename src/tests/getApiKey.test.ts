import { describe, expect, test } from "vitest";
import { getAPIKey } from "../api/auth";

describe("getAPIKey", () => {
  test("should return null when authorization header is missing", () => {
    const headers = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should return null when authorization header is empty", () => {
    const headers = { authorization: "" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should return null when authorization header has no space separator", () => {
    const headers = { authorization: "InvalidFormat" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should return null when authorization header has wrong prefix", () => {
    const headers = { authorization: "Bearer mykey123" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should return null when authorization header has only one part after split", () => {
    const headers = { authorization: "ApiKey" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should return the API key when authorization header is correctly formatted", () => {
    const headers = { authorization: "ApiKey mySecretKey123" };
    expect(getAPIKey(headers)).toBe("mySecretKey123");
  });

  test("should return the API key when there are extra spaces in the header", () => {
    const headers = { authorization: "ApiKey token-with-special-chars_456" };
    expect(getAPIKey(headers)).toBe("token-with-special-chars_456");
  });

  test("should be case-sensitive for ApiKey prefix", () => {
    const headers = { authorization: "apikey mykey123" };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("should handle authorization header with multiple spaces between key and value", () => {
    const headers = { authorization: "ApiKey   mykey123" };
    expect(getAPIKey(headers)).toBe("");
  });

  test("should work with various valid API key formats", () => {
    const testCases = [
      { header: "ApiKey abc123", expected: "abc123" },
      { header: "ApiKey 12345-67890-abcde", expected: "12345-67890-abcde" },
      { header: "ApiKey key_with_underscore", expected: "key_with_underscore" },
      { header: "ApiKey key.with.dots", expected: "key.with.dots" },
    ];

    testCases.forEach(({ header, expected }) => {
      const headers = { authorization: header };
      expect(getAPIKey(headers)).toBe(expected);
    });
  });
});

