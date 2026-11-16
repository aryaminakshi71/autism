import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../ui/index";

describe("Input Component", () => {
  it("renders input element", () => {
    render(<Input />);
    expect(document.querySelector("input")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);

    fireEvent.change(document.querySelector("input")!, {
      target: { value: "test" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("shows error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("shows helper text when no error", () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input error="Error" helperText="Helper" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("applies disabled attribute", () => {
    render(<Input disabled />);
    expect(document.querySelector("input")).toBeDisabled();
  });

  it("shows required indicator", () => {
    render(<Input label="Email" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);
    expect(document.querySelector("input")).toHaveClass("custom-input");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(document.querySelector("input"));
  });

  it("sets correct input type", () => {
    render(<Input type="password" />);
    expect(document.querySelector("input")).toHaveAttribute("type", "password");
  });

  it("renders with left icon", () => {
    const LeftIcon = () => <span data-testid="left-icon">icon</span>;
    render(<Input leftIcon={<LeftIcon />} />);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    const RightIcon = () => <span data-testid="right-icon">icon</span>;
    render(<Input rightIcon={<RightIcon />} />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("associates label with input via id", () => {
    render(<Input label="Username" name="username" />);
    const input = document.querySelector("input");
    const label = document.querySelector("label");
    expect(label).toHaveAttribute("for", input?.id);
  });
});
