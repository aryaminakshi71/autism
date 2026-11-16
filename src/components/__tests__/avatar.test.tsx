import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "../ui/index";

describe("Avatar Component", () => {
  it("renders with fallback text", () => {
    render(<Avatar fallback="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="User Avatar"
        fallback="JD"
      />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "User Avatar");
  });

  it("applies size small", () => {
    const { container } = render(<Avatar fallback="Small" size="sm" />);
    const innerDiv = container.querySelector('[class*="h-8"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("h-8");
    expect(innerDiv).toHaveClass("w-8");
  });

  it("applies size medium (default)", () => {
    const { container } = render(<Avatar fallback="Medium" />);
    const innerDiv = container.querySelector('[class*="h-10"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("h-10");
    expect(innerDiv).toHaveClass("w-10");
  });

  it("applies size large", () => {
    const { container } = render(<Avatar fallback="Large" size="lg" />);
    const innerDiv = container.querySelector('[class*="h-12"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("h-12");
    expect(innerDiv).toHaveClass("w-12");
  });

  it("applies size extra large", () => {
    const { container } = render(<Avatar fallback="Extra Large" size="xl" />);
    const innerDiv = container.querySelector('[class*="h-16"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("h-16");
    expect(innerDiv).toHaveClass("w-16");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Avatar fallback="Custom Avatar" className="custom-avatar" />,
    );
    expect(container.firstChild).toHaveClass("custom-avatar");
  });

  it("has rounded-full class by default", () => {
    const { container } = render(<Avatar fallback="Rounded" />);
    const innerDiv = container.querySelector('[class*="rounded-full"]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("rounded-full");
  });

  it("renders with status indicator", () => {
    const { container } = render(<Avatar fallback="Online" status="online" />);
    expect(container.querySelector(".bg-emerald-500")).toBeInTheDocument();
  });
});
