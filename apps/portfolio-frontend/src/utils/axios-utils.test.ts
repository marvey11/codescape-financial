import { buildAxiosRequestConfig } from "./axios-utils";

describe("buildAxiosRequestConfig", () => {
  it("should build a basic GET request config", () => {
    const config = buildAxiosRequestConfig("/test");
    expect(config).toEqual({
      url: "/test",
      method: "get",
    });
  });

  it("should build a POST request config with data", () => {
    const payload = { key: "value" };
    const config = buildAxiosRequestConfig("/test", {
      method: "post",
      data: payload,
    });
    expect(config).toEqual({
      url: "/test",
      method: "post",
      data: payload,
    });
  });

  it("should interpolate path parameters", () => {
    const config = buildAxiosRequestConfig("/test/:id", {
      params: { id: "123" },
    });
    expect(config).toEqual({
      url: "/test/123",
      method: "get",
    });
  });

  it("should add query parameters", () => {
    const config = buildAxiosRequestConfig("/test", {
      queryParams: { param1: "value1", param2: "value2" },
    });
    expect(config).toEqual({
      url: "/test",
      method: "get",
      params: { param1: "value1", param2: "value2" },
    });
  });

  it("should combine path parameters and query parameters", () => {
    const config = buildAxiosRequestConfig("/test/:id", {
      params: { id: "123" },
      queryParams: { param1: "value1" },
    });
    expect(config).toEqual({
      url: "/test/123",
      method: "get",
      params: { param1: "value1" },
    });
  });

  it("should handle empty config object", () => {
    const config = buildAxiosRequestConfig("/test", {});
    expect(config).toEqual({
      url: "/test",
      method: "get",
    });
  });

  it("should return the correct method if specified", () => {
    const config = buildAxiosRequestConfig("/test", { method: "put" });
    expect(config).toEqual({
      url: "/test",
      method: "put",
    });
  });

  it("should return the correct method if specified in uppercase", () => {
    const config = buildAxiosRequestConfig("/test", { method: "POST" });
    expect(config).toEqual({
      url: "/test",
      method: "POST",
    });
  });
});
