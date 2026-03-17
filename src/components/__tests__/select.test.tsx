import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../ui/Select";

describe("Select Component", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders select element", () => {
    render(<Select options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label="Select Option" options={options} />);
    expect(screen.getByLabelText("Select Option")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={options} />);
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 3" })).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "option2" } });

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
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Select options={options} className="custom-select" />);
    expect(screen.getByRole("combobox")).toHaveClass("custom-select");
  });

  it("associates label with select", () => {
    render(<Select label="Country" name="country" options={options} />);
    expect(screen.getByLabelText("Country")).toHaveAttribute("id");
  });

  it("shows required indicator", () => {
    render(<Select label="Status" required options={options} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
