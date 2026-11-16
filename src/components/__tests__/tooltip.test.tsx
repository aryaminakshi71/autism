import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../ui/index";

describe("Tooltip Component", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders tooltip content", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("has group class for hover interaction", () => {
    const { container } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.firstChild).toHaveClass("group");
  });

  it("has relative positioning", () => {
    const { container } = render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.firstChild).toHaveClass("relative");
  });
});
