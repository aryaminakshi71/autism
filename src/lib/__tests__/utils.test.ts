import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  capitalize,
  debounce,
  formatBytes,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  generateId,
  getInitials,
  groupBy,
  isValidEmail,
  isValidPhone,
  omit,
  parseJSON,
  pick,
  pluralize,
  slugify,
  sortBy,
  throttle,
  truncate,
  uniqueBy,
} from "../utils";

describe("Utility Functions", () => {
  describe("formatDate", () => {
    it("formats date string correctly", () => {
      expect(formatDate("2024-01-15")).toBe("Jan 15, 2024");
    });

    it("formats Date object correctly", () => {
      expect(formatDate(new Date("2024-01-15"))).toBe("Jan 15, 2024");
    });
  });

  describe("formatDateTime", () => {
    it("formats date and time correctly", () => {
      const result = formatDateTime("2024-01-15T10:30:00");
      expect(result).toContain("Jan 15, 2024");
      expect(result).toContain("10:30");
    });
  });

  describe("formatRelativeTime", () => {
    it('returns "Just now" for recent dates', () => {
      expect(formatRelativeTime(new Date())).toBe("Just now");
    });

    it("returns minutes ago for recent times", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5m ago");
    });

    it("returns hours ago for today", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
    });

    it("returns days ago for older dates", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe("3d ago");
    });
  });

  describe("isValidEmail", () => {
    it("returns true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.org")).toBe(true);
      expect(isValidEmail("user+tag@example.co.uk")).toBe(true);
    });

    it("returns false for invalid emails", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("invalid@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("returns true for valid phone numbers", () => {
      expect(isValidPhone("+1234567890")).toBe(true);
      expect(isValidPhone("123-456-7890")).toBe(true);
      expect(isValidPhone("+1 234 567 8901")).toBe(true);
    });

    it("returns false for invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  describe("slugify", () => {
    it("converts text to slug format", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Test String!")).toBe("test-string");
      expect(slugify("Multiple   Spaces")).toBe("multiple-spaces");
    });

    it("removes special characters", () => {
      expect(slugify("Hello@World#123")).toBe("helloworld123");
    });
  });

  describe("truncate", () => {
    it("truncates long text", () => {
      expect(truncate("Hello World", 5)).toBe("Hello...");
    });

    it("returns original text if shorter", () => {
      expect(truncate("Hi", 10)).toBe("Hi");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("delays function execution", () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("limits function calls", () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("generates IDs of specified length", () => {
      const id = generateId(16);
      expect(id.length).toBe(16);
    });
  });

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("Hello");
    });
  });

  describe("pluralize", () => {
    it("returns singular for 1", () => {
      expect(pluralize(1, "apple")).toBe("apple");
    });

    it("returns plural for other numbers", () => {
      expect(pluralize(2, "apple")).toBe("apples");
      expect(pluralize(0, "apple")).toBe("apples");
    });

    it("uses custom plural", () => {
      expect(pluralize(2, "child", "children")).toBe("children");
    });
  });

  describe("groupBy", () => {
    it("groups objects by key", () => {
      const data = [
        { name: "Alice", role: "admin" },
        { name: "Bob", role: "user" },
        { name: "Charlie", role: "admin" },
      ];

      const grouped = groupBy(data, "role");

      expect(grouped.admin).toHaveLength(2);
      expect(grouped.user).toHaveLength(1);
    });
  });

  describe("sortBy", () => {
    it("sorts ascending by default", () => {
      const data = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 28 },
      ];

      const sorted = sortBy(data, "age");

      expect(sorted[0].name).toBe("Alice");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Charlie");
    });

    it("sorts descending", () => {
      const data = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 28 },
      ];

      const sorted = sortBy(data, "age", "desc");

      expect(sorted[0].name).toBe("Charlie");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Alice");
    });
  });

  describe("uniqueBy", () => {
    it("removes duplicates by key", () => {
      const data = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alice" },
        { id: 3, name: "Charlie" },
      ];

      const unique = uniqueBy(data, "id");

      expect(unique).toHaveLength(3);
    });
  });

  describe("pick", () => {
    it("picks specified keys", () => {
      const obj = { name: "Alice", age: 25, email: "alice@example.com" };
      const picked = pick(obj, ["name", "email"]);

      expect(picked).toEqual({ name: "Alice", email: "alice@example.com" });
    });
  });

  describe("omit", () => {
    it("omits specified keys", () => {
      const obj = { name: "Alice", age: 25, email: "alice@example.com" };
      const omitted = omit(obj, ["age"]);

      expect(omitted).toEqual({ name: "Alice", email: "alice@example.com" });
    });
  });

  describe("parseJSON", () => {
    it("parses valid JSON", () => {
      expect(parseJSON('{"name":"Alice"}', {})).toEqual({ name: "Alice" });
    });

    it("returns fallback for invalid JSON", () => {
      expect(parseJSON("invalid", { name: "Bob" })).toEqual({ name: "Bob" });
    });
  });

  describe("formatBytes", () => {
    it("formats bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1024 * 1024)).toBe("1 MB");
      expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
    });
  });

  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
      expect(formatCurrency(99.99)).toBe("$99.99");
    });
  });

  describe("formatPercentage", () => {
    it("formats percentages correctly", () => {
      expect(formatPercentage(50)).toBe("50.0%");
      expect(formatPercentage(33.333, 2)).toBe("33.33%");
    });
  });

  describe("getInitials", () => {
    it("extracts initials from name", () => {
      expect(getInitials("Alice Johnson")).toBe("AJ");
      expect(getInitials("Bob")).toBe("B");
      expect(getInitials("Alice Maria Johnson")).toBe("AM");
    });
  });
});
