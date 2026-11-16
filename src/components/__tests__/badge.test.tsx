import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "../ui/index";

describe("Badge Component", () => {
  it("renders with children", () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-indigo-100");
    expect(badge).toHaveClass("text-indigo-700");
  });

  it("applies secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText("Secondary");
    expect(badge).toHaveClass("bg-gray-100");
    expect(badge).toHaveClass("text-gray-700");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-emerald-100");
    expect(badge).toHaveClass("text-emerald-700");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText("Warning");
    expect(badge).toHaveClass("bg-amber-100");
    expect(badge).toHaveClass("text-amber-700");
  });

  it("applies destructive variant", () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText("Destructive");
    expect(badge).toHaveClass("bg-red-100");
    expect(badge).toHaveClass("text-red-700");
  });

  it("applies info variant", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText("Info");
    expect(badge).toHaveClass("bg-sky-100");
    expect(badge).toHaveClass("text-sky-700");
  });

  it("applies outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("border-gray-200");
  });

  it("applies small size", () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText("Small");
    expect(badge).toHaveClass("px-2");
    expect(badge).toHaveClass("text-[10px]");
  });

  it("applies medium size by default", () => {
    render(<Badge>Medium</Badge>);
    const badge = screen.getByText("Medium");
    expect(badge).toHaveClass("px-2.5");
    expect(badge).toHaveClass("text-xs");
  });

  it("applies large size", () => {
    render(<Badge size="lg">Large</Badge>);
    const badge = screen.getByText("Large");
    expect(badge).toHaveClass("px-3");
    expect(badge).toHaveClass("text-sm");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-badge");
  });

  it("badgeVariants returns correct classes for default variant", () => {
    expect(badgeVariants({})).toContain("bg-indigo-100");
  });

  it("badgeVariants returns correct classes for success variant", () => {
    expect(badgeVariants({ variant: "success" })).toContain("bg-emerald-100");
  });
});
