import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "../ui/index";

describe("Progress Component", () => {
  it("renders progress bar", () => {
    render(<Progress value={50} />);
    const progressBar = document.querySelector('[class*="bg-indigo-500"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("renders with correct width based on value", () => {
    const { container } = render(<Progress value={75} />);
    const progressFill = container.querySelector('[style*="width"]');
    expect(progressFill).toHaveAttribute(
      "style",
      expect.stringContaining("75%"),
    );
  });

  it("applies default size", () => {
    render(<Progress value={50} />);
    const progressTrack = document.querySelector('[class*="h-2.5"]');
    expect(progressTrack).toBeInTheDocument();
  });

  it("applies small size", () => {
    render(<Progress value={50} size="sm" />);
    const progressTrack = document.querySelector('[class*="h-1.5"]');
    expect(progressTrack).toBeInTheDocument();
  });

  it("applies large size", () => {
    render(<Progress value={50} size="lg" />);
    const progressTrack = document.querySelector('[class*="h-4"]');
    expect(progressTrack).toBeInTheDocument();
  });

  it("applies default variant (indigo)", () => {
    render(<Progress value={50} />);
    const progressFill = document.querySelector('[class*="bg-indigo-500"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("applies success variant", () => {
    render(<Progress value={50} variant="success" />);
    const progressFill = document.querySelector('[class*="bg-emerald-500"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("applies warning variant", () => {
    render(<Progress value={50} variant="warning" />);
    const progressFill = document.querySelector('[class*="bg-amber-500"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("applies danger variant", () => {
    render(<Progress value={50} variant="danger" />);
    const progressFill = document.querySelector('[class*="bg-red-500"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("applies info variant", () => {
    render(<Progress value={50} variant="info" />);
    const progressFill = document.querySelector('[class*="bg-sky-500"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("shows value percentage when showValue is true", () => {
    render(<Progress value={75} showValue />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("shows value/max when showValue is true", () => {
    render(<Progress value={75} max={100} showValue />);
    expect(screen.getByText("75 / 100")).toBeInTheDocument();
  });

  it("respects max value", () => {
    render(<Progress value={50} max={200} />);
    const progressFill = document.querySelector('[style*="width: 25%"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("caps at 100%", () => {
    render(<Progress value={150} max={100} />);
    const progressFill = document.querySelector('[style*="width: 100%"]');
    expect(progressFill).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Progress value={50} className="custom-progress" />);
    const container = document.querySelector(".custom-progress");
    expect(container).toBeInTheDocument();
  });
});
