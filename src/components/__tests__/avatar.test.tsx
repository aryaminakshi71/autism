import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../ui/Avatar";

describe("Avatar Component", () => {
  it("renders with children", () => {
    render(<Avatar>JD</Avatar>);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User Avatar" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "User Avatar");
  });

  it("falls back to children when image fails", () => {
    render(
      <Avatar src="invalid-url" fallback="AB">
        AB
      </Avatar>
    );
    // The component should render fallback
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("applies size small", () => {
    render(<Avatar size="sm">SM</Avatar>);
    const avatar = screen.getByText("SM").parentElement;
    expect(avatar).toHaveClass("h-8");
    expect(avatar).toHaveClass("w-8");
  });

  it("applies size medium (default)", () => {
    render(<Avatar>MD</Avatar>);
    const avatar = screen.getByText("MD").parentElement;
    expect(avatar).toHaveClass("h-10");
    expect(avatar).toHaveClass("w-10");
  });

  it("applies size large", () => {
    render(<Avatar size="lg">LG</Avatar>);
    const avatar = screen.getByText("LG").parentElement;
    expect(avatar).toHaveClass("h-12");
    expect(avatar).toHaveClass("w-12");
  });

  it("applies size extra large", () => {
    render(<Avatar size="xl">XL</Avatar>);
    const avatar = screen.getByText("XL").parentElement;
    expect(avatar).toHaveClass("h-16");
    expect(avatar).toHaveClass("w-16");
  });

  it("applies custom className", () => {
    render(<Avatar className="custom-avatar">CA</Avatar>);
    expect(screen.getByText("CA").parentElement).toHaveClass("custom-avatar");
  });

  it("has rounded-full class by default", () => {
    render(<Avatar>Rounded</Avatar>);
    expect(screen.getByText("Rounded").parentElement).toHaveClass("rounded-full");
  });

  it("renders with status indicator", () => {
    render(
      <Avatar status="online">
        <Avatar statusIndicator>ON</Avatar>
      </Avatar>
    );
    // Status indicator should render
    expect(screen.getByText("ON")).toBeInTheDocument();
  });
});
