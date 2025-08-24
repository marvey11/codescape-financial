import { interpolatePath } from "./api-utils";

describe("interpolatePath", () => {
  it("should replace parameters in the path with provided values", () => {
    const path = "/users/:id/posts/:postId";
    const params = { id: "123", postId: "abc" };
    const result = interpolatePath(path, params);
    expect(result).toBe("/users/123/posts/abc");
  });

  it("should handle multiple occurrences of the same parameter", () => {
    const path = "/items/:id/details/:id";
    const params = { id: "xyz" };
    const result = interpolatePath(path, params);
    expect(result).toBe("/items/xyz/details/xyz");
  });

  it("should not modify the path if no parameters are provided", () => {
    const path = "/users";
    const result = interpolatePath(path);
    expect(result).toBe("/users");
  });

  it("should not modify the path if parameters are provided but not found in the path", () => {
    const path = "/users";
    const params = { id: "123" };
    const result = interpolatePath(path, params);
    expect(result).toBe("/users");
  });

  it("should handle parameters with numeric values", () => {
    const path = "/products/:productId";
    const params = { productId: 456 };
    const result = interpolatePath(path, params);
    expect(result).toBe("/products/456");
  });

  it("should handle empty path string", () => {
    const path = "";
    const params = { id: "123" };
    const result = interpolatePath(path, params);
    expect(result).toBe("");
  });

  it("should handle path with only parameters", () => {
    const path = ":param1/:param2";
    const params = { param1: "value1", param2: "value2" };
    const result = interpolatePath(path, params);
    expect(result).toBe("value1/value2");
  });
});
