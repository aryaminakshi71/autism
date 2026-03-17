import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "../ui/EmptyState";

describe("EmptyState Component", () => {
  it("renders title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No items"
        description="There are no items to display"
      />
    );
    expect(screen.getByText("There are no items to display")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(<EmptyState title="Empty" icon="📂" />);
    expect(screen.getByText("📂")).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Add Item</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument();
  });

  it("renders without description when not provided", () => {
    render(<EmptyState title="Just Title" />);
    expect(screen.queryByRole("paragraph")).toBeNull();
  });

  it("renders without icon when not provided", () => {
    render(<EmptyState title="No Icon" />);
    // Should only have the title
    const title = screen.getByText("No Icon");
    expect(title.parentElement?.children.length).toBe(1);
  });

  it("renders without action when not provided", () => {
    render(<EmptyState title="No Action" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("applies custom className", () => {
    render(<EmptyState title="Custom" className="custom-empty" />);
    expect(screen.getByText("Custom").closest("div")).toHaveClass("custom-empty");
  });
});
