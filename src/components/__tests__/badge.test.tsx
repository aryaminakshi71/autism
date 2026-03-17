import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "../ui/Badge";

describe("Badge Component", () => {
  it("renders with children", () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-gray-100");
    expect(badge).toHaveClass("text-gray-800");
  });

  it("applies primary variant", () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText("Primary");
    expect(badge).toHaveClass("bg-blue-100");
    expect(badge).toHaveClass("text-blue-800");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-green-100");
    expect(badge).toHaveClass("text-green-800");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText("Warning");
    expect(badge).toHaveClass("bg-yellow-100");
    expect(badge).toHaveClass("text-yellow-800");
  });

  it("applies danger variant", () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText("Danger");
    expect(badge).toHaveClass("bg-red-100");
    expect(badge).toHaveClass("text-red-800");
  });

  it("applies info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText("Info");
    expect(badge).toHaveClass("bg-cyan-100");
    expect(badge).toHaveClass("text-cyan-800");
  });

  it("applies outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("border-gray-300");
  });

  it("applies small size", () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText("Small");
    expect(badge).toHaveClass("px-2");
    expect(badge).toHaveClass("py-0.5");
    expect(badge).toHaveClass("text-xs");
  });

  it("applies medium size by default", () => {
    render(<Badge>Medium</Badge>);
    const badge = screen.getByText("Medium");
    expect(badge).toHaveClass("px-2.5");
    expect(badge).toHaveClass("py-1");
    expect(badge).toHaveClass("text-sm");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-badge");
  });

  it("badgeVariants returns correct classes for default variant", () => {
    expect(badgeVariants({})).toContain("bg-gray-100");
  });

  it("badgeVariants returns correct classes for success variant", () => {
    expect(badgeVariants({ variant: "success" })).toContain("bg-green-100");
  });
});
