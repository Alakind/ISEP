import {describe, expect, it, vi} from "vitest";
import {canCancelInvite, canDeleteInvite, canRemindInvite, getDateFormatted, scrollToAssignment, testUuidValidity} from "../../src/utils/general.tsx";
import {InviteStatuses} from "../../src/utils/constants.tsx";


describe("Invite Function Tests", () => {
  describe("canCancelInvite", () => {
    it("should return correct boolean for each status", () => {
      expect(canCancelInvite(InviteStatuses.NOT_STARTED)).toBe(true);
      expect(canCancelInvite(InviteStatuses.CANCELLED)).toBe(false);
      expect(canCancelInvite(InviteStatuses.EXPIRED)).toBe(false);
      expect(canCancelInvite(InviteStatuses.APP_REMINDED_ONCE)).toBe(true);
      expect(canCancelInvite(InviteStatuses.APP_REMINDED_TWICE)).toBe(true);
      expect(canCancelInvite(InviteStatuses.APP_STARTED)).toBe(false);
      expect(canCancelInvite(InviteStatuses.APP_FINISHED)).toBe(false);
      expect(canCancelInvite("UNKNOWN_STATUS")).toBe(true);
    });
  });

  describe("canDeleteInvite", () => {
    it("should return correct boolean for each status", () => {
      expect(canDeleteInvite(InviteStatuses.NOT_STARTED)).toBe(true);
      expect(canDeleteInvite(InviteStatuses.CANCELLED)).toBe(true);
      expect(canDeleteInvite(InviteStatuses.EXPIRED)).toBe(true);
      expect(canDeleteInvite(InviteStatuses.APP_REMINDED_ONCE)).toBe(true);
      expect(canDeleteInvite(InviteStatuses.APP_REMINDED_TWICE)).toBe(true);
      expect(canDeleteInvite(InviteStatuses.APP_STARTED)).toBe(false);
      expect(canDeleteInvite(InviteStatuses.APP_FINISHED)).toBe(false);
      expect(canDeleteInvite("UNKNOWN_STATUS")).toBe(true);
    });
  });

  describe("canRemindInvite", () => {
    it("should return correct boolean for each status", () => {
      expect(canRemindInvite(InviteStatuses.NOT_STARTED)).toBe(true);
      expect(canRemindInvite(InviteStatuses.CANCELLED)).toBe(false);
      expect(canRemindInvite(InviteStatuses.EXPIRED)).toBe(false);
      expect(canRemindInvite(InviteStatuses.APP_REMINDED_ONCE)).toBe(true);
      expect(canRemindInvite(InviteStatuses.APP_REMINDED_TWICE)).toBe(false);
      expect(canRemindInvite(InviteStatuses.APP_STARTED)).toBe(false);
      expect(canRemindInvite(InviteStatuses.APP_FINISHED)).toBe(false);
      expect(canRemindInvite("UNKNOWN_STATUS")).toBe(true);
    });
  });

  describe("testUuidValidity", () => {
    it("should validate correct UUIDs", () => {
      expect(testUuidValidity("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
      expect(testUuidValidity("123e4567e89b12d3a456426614174000")).toBe(false);
      expect(testUuidValidity("invalid-uuid")).toBe(false);
    });
  });

  describe("scrollToAssignment", () => {
    it("should scroll to element if it exists", () => {
      const mockElement = {scrollIntoView: vi.fn()};
      document.getElementById = vi.fn().mockReturnValue(mockElement);

      scrollToAssignment("test-id");

      expect(document.getElementById).toHaveBeenCalledWith("test-id");
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });

    it("should do nothing if element does not exist", () => {
      document.getElementById = vi.fn().mockReturnValue(null);

      scrollToAssignment("test-id");

      expect(document.getElementById).toHaveBeenCalledWith("test-id");
    });
  });

  describe("getDateFormatted", () => {
    it("should format the date correctly", () => {
      expect(getDateFormatted("2023-01-01T00:00:00Z")).toBe("2023-01-01");
      expect(getDateFormatted("2025-12-31T22:59:00Z")).toBe("2025-12-31");
    });

    it("should handle invalid date strings", () => {
      expect(getDateFormatted("invalid-date")).toBe("NaN-NaN-NaN");
    });
  });
});