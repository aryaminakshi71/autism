import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Spinner } from "../ui/Spinner";

describe("Spinner Component", () => {
  it("renders spinner element", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with default size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-6");
    expect(spinner).toHaveClass("w-6");
  });

  it("renders with small size", () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-4");
    expect(spinner).toHaveClass("w-4");
  });

  it("renders with medium size", () => {
    render(<Spinner size="md" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-6");
    expect(spinner).toHaveClass("w-6");
  });

  it("renders with large size", () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-8");
    expect(spinner).toHaveClass("w-8");
  });

  it("renders with custom className", () => {
    render(<Spinner className="custom-spinner" />);
    expect(screen.getByRole("status")).toHaveClass("custom-spinner");
  });

  it("has proper accessibility role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("role", "status");
  });

  it("contains aria-label", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner.getAttribute("aria-label")).toBeTruthy();
  });
});
