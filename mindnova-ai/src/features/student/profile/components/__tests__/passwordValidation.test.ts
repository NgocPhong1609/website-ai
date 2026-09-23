import { describe, it, expect } from "vitest";
import { validatePassword } from "../OtherPanels";

describe("validatePassword for Mật khẩu hiện tại & Mật khẩu mới", () => {
  it("fails when password is 12345678 (missing uppercase and special character)", () => {
    const result = validatePassword("12345678", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("phải chứa ít nhất 1 chữ hoa");
  });

  it("fails when password is abcdefgh (missing uppercase, number, and special character)", () => {
    const result = validatePassword("abcdefgh", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("phải chứa ít nhất 1 chữ hoa");
  });

  it("fails when password is Abcdefgh (missing number and special character)", () => {
    const result = validatePassword("Abcdefgh", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("phải chứa ít nhất 1 chữ số");
  });

  it("fails when password is Abcdefg1 (missing special character)", () => {
    const result = validatePassword("Abcdefg1", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("phải chứa ít nhất 1 ký tự đặc biệt");
  });

  it("passes when password is Abcdef1! (valid: 8 chars, 1 uppercase, 1 digit, 1 special char)", () => {
    const result = validatePassword("Abcdef1!", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("fails when password is Abc123! (less than 8 characters)", () => {
    const result = validatePassword("Abc123!", "Mật khẩu hiện tại");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("phải có tối thiểu 8 ký tự");
  });
});
