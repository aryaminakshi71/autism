import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../ui/Input";

describe("Input Component", () => {
  it("renders input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test" } });

    expect(onChange).toHaveBeenCalled();
  });

  it("shows error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("This field is required");
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
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows required indicator", () => {
    render(<Input label="Email" required />);
    expect(screen.getByLabelText(/required/)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("sets correct input type", () => {
    render(<Input type="password" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "password");
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
    expect(screen.getByLabelText("Username")).toHaveAttribute("id");
  });
});
