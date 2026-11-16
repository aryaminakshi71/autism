import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "../ui/index";

describe("Skeleton Component", () => {
  it("renders skeleton element", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("has bg-gray-200 class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("bg-gray-200");
  });

  it("has rounded-lg class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.firstChild).toHaveClass("custom-skeleton");
  });

  it("applies custom dimensions via className", () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);
    expect(container.firstChild).toHaveClass("h-10");
    expect(container.firstChild).toHaveClass("w-full");
  });
});
