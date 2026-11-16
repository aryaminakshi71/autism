import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Card } from "../ui/index";

describe("Card Component", () => {
  it("renders children", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders with header prop", () => {
    render(<Card header={<div>Header Content</div>}>Card Body</Card>);
    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Card Body")).toBeInTheDocument();
  });

  it("renders with footer prop", () => {
    render(<Card footer={<div>Footer Content</div>}>Card Body</Card>);
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
    expect(screen.getByText("Card Body")).toBeInTheDocument();
  });

  it("applies variant default correctly", () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText("Default Card").parentElement;
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("rounded-xl");
  });

  it("applies padding none", () => {
    render(<Card padding="none">No Padding</Card>);
    const card = screen.getByText("No Padding").parentElement;
    expect(card).toHaveClass("p-0");
  });

  it("applies padding sm", () => {
    render(<Card padding="sm">Small Padding</Card>);
    const card = screen.getByText("Small Padding").parentElement;
    expect(card).toHaveClass("p-4");
  });

  it("applies padding default", () => {
    render(<Card>Default Padding</Card>);
    const card = screen.getByText("Default Padding").parentElement;
    expect(card).toHaveClass("p-6");
  });

  it("applies padding lg", () => {
    render(<Card padding="lg">Large Padding</Card>);
    const card = screen.getByText("Large Padding").parentElement;
    expect(card).toHaveClass("p-8");
  });

  it("applies variant ghost", () => {
    render(<Card variant="ghost">Ghost Card</Card>);
    const card = screen.getByText("Ghost Card").parentElement;
    expect(card).toHaveClass("border-transparent");
  });

  it("applies variant interactive", () => {
    render(<Card variant="interactive">Interactive Card</Card>);
    const card = screen.getByText("Interactive Card").parentElement;
    expect(card).toHaveClass("cursor-pointer");
    expect(card).toHaveClass("hover:shadow-lg");
  });

  it("applies variant elevated", () => {
    render(<Card variant="elevated">Elevated Card</Card>);
    const card = screen.getByText("Elevated Card").parentElement;
    expect(card).toHaveClass("shadow-lg");
  });

  it("applies custom className", () => {
    render(<Card className="custom-card">Custom</Card>);
    expect(screen.getByText("Custom").parentElement).toHaveClass("custom-card");
  });

  it("forwards ref to underlying div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Test</Card>);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByText("Ref Test").parentElement);
  });
});
