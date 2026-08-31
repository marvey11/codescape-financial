import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import App from "./App";

describe("App", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<App />, { wrapper: BrowserRouter });
    expect(baseElement).toBeTruthy();
  });
});
