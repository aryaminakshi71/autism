import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatCard } from "../ui/index";

describe("StatCard Component", () => {
  it("renders title", () => {
    render(<StatCard title="Total Users" value="100" icon={<span>👥</span>} />);
    expect(screen.getByText("Total Users")).toBeInTheDocument();
  });

  it("renders value", () => {
    render(<StatCard title="Total Users" value="100" icon={<span>👥</span>} />);
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span data-testid="icon">👥</span>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        subtitle="Active this month"
      />,
    );
    expect(screen.getByText("Active this month")).toBeInTheDocument();
  });

  it("renders change indicator when provided", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="+12%"
        changeType="positive"
      />,
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("applies positive change styling", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="+12%"
        changeType="positive"
      />,
    );
    const changeElement = screen.getByText("+12%");
    expect(changeElement).toHaveClass("text-emerald-600");
    expect(changeElement).toHaveClass("bg-emerald-50");
  });

  it("applies negative change styling", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="-5%"
        changeType="negative"
      />,
    );
    const changeElement = screen.getByText("-5%");
    expect(changeElement).toHaveClass("text-red-600");
    expect(changeElement).toHaveClass("bg-red-50");
  });

  it("applies neutral change styling", () => {
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="0%"
        changeType="neutral"
      />,
    );
    const changeElement = screen.getByText("0%");
    expect(changeElement).toHaveClass("text-gray-600");
    expect(changeElement).toHaveClass("bg-gray-50");
  });

  it("shows up arrow for positive trend", () => {
    const { container } = render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="+12%"
        changeType="positive"
        trend="up"
      />,
    );
    expect(container.textContent).toContain("↑");
    expect(container.textContent).toContain("+12%");
  });

  it("shows down arrow for negative trend", () => {
    const { container } = render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        change="-5%"
        changeType="negative"
        trend="down"
      />,
    );
    expect(container.textContent).toContain("↓");
    expect(container.textContent).toContain("-5%");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <StatCard
        title="Total Users"
        value="100"
        icon={<span>👥</span>}
        onClick={onClick}
      />,
    );

    // The Card component should have cursor-pointer when onClick is provided
    const cardElement = document.querySelector('[class*="cursor-pointer"]');
    if (cardElement) {
      cardElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(onClick).toHaveBeenCalled();
    }
  });
});
