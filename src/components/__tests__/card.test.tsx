import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";

describe("Card Component", () => {
  it("renders children", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders with CardHeader", () => {
    render(
      <Card>
        <CardHeader>Header Content</CardHeader>
      </Card>
    );
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("renders with CardTitle", () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders with CardDescription", () => {
    render(
      <Card>
        <CardDescription>Description text</CardDescription>
      </Card>
    );
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("renders with CardContent", () => {
    render(
      <Card>
        <CardContent>Main content</CardContent>
      </Card>
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders with CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies hover class when hover prop is true", () => {
    render(<Card hover>Hoverable Card</Card>);
    const card = screen.getByText("Hoverable Card");
    expect(card).toHaveClass("cursor-pointer");
    expect(card).toHaveClass("hover:shadow-md");
  });

  it("does not apply hover class when hover is false", () => {
    render(<Card hover={false}>Non-hoverable Card</Card>);
    const card = screen.getByText("Non-hoverable Card");
    expect(card).not.toHaveClass("cursor-pointer");
  });

  it("applies padding none", () => {
    render(<Card padding="none">No Padding</Card>);
    expect(screen.getByText("No Padding").parentElement).toHaveClass("p-0");
  });

  it("applies padding sm", () => {
    render(<Card padding="sm">Small Padding</Card>);
    expect(screen.getByText("Small Padding").parentElement).toHaveClass("p-3");
  });

  it("applies padding md (default)", () => {
    render(<Card>Default Padding</Card>);
    expect(screen.getByText("Default Padding").parentElement).toHaveClass("p-5");
  });

  it("applies padding lg", () => {
    render(<Card padding="lg">Large Padding</Card>);
    expect(screen.getByText("Large Padding").parentElement).toHaveClass("p-6");
  });

  it("applies border class by default", () => {
    render(<Card>With Border</Card>);
    expect(screen.getByText("With Border").parentElement).toHaveClass("border");
  });

  it("removes border when border prop is false", () => {
    render(<Card border={false}>No Border</Card>);
    expect(screen.getByText("No Border").parentElement).not.toHaveClass("border");
  });

  it("renders with icon", () => {
    render(<Card icon="🎯">With Icon</Card>);
    expect(screen.getByText("🎯")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-card">Custom</Card>);
    expect(screen.getByText("Custom")).toHaveClass("custom-card");
  });

  it("CardHeader has correct styling", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    const header = screen.getByText("Header");
    expect(header.parentElement).toHaveClass("flex");
    expect(header.parentElement).toHaveClass("flex-col");
  });

  it("CardTitle has correct styling", () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    );
    const title = screen.getByText("Title");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("text-lg");
  });

  it("CardDescription has correct styling", () => {
    render(
      <Card>
        <CardDescription>Description</CardDescription>
      </Card>
    );
    const desc = screen.getByText("Description");
    expect(desc).toHaveClass("text-sm");
    expect(desc).toHaveClass("text-gray-500");
  });

  it("forwards ref to underlying div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Test</Card>);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByText("Ref Test"));
  });
});
