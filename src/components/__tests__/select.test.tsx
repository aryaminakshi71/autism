import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../ui/index";

describe("Select Component", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders select element", () => {
    render(<Select options={options} />);
    expect(document.querySelector("select")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label="Select Option" options={options} />);
    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={options} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    fireEvent.change(document.querySelector("select")!, {
      target: { value: "option2" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("shows error message", () => {
    render(<Select options={options} error="Please select an option" />);
    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("shows helper text when no error", () => {
    render(<Select options={options} helperText="Choose one" />);
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("applies disabled attribute", () => {
    render(<Select options={options} disabled />);
    expect(document.querySelector("select")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Select options={options} className="custom-select" />);
    expect(document.querySelector("select")).toHaveClass("custom-select");
  });

  it("shows required indicator", () => {
    render(<Select label="Status" required options={options} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("associates label with select", () => {
    render(<Select label="Country" name="country" options={options} />);
    const select = document.querySelector("select");
    const label = document.querySelector("label");
    expect(label).toHaveAttribute("for", select?.id);
  });

  it("applies small size", () => {
    render(<Select options={options} size="sm" />);
    expect(document.querySelector("select")).toHaveClass("h-9");
  });

  it("applies large size", () => {
    render(<Select options={options} size="lg" />);
    expect(document.querySelector("select")).toHaveClass("h-12");
  });
});
