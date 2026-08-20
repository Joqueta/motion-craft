import { describe, expect, it } from "./runner.js";
import { isNavLinkActive } from "../components/fritzi/admin/admin-nav.js";

describe("isNavLinkActive", () => {
  it("marks Projects active on the hub itself", () => {
    expect(isNavLinkActive("/fritzi/admin", "/fritzi/admin")).toBeTruthy();
  });

  it("marks Projects active on the new-project route", () => {
    expect(isNavLinkActive("/fritzi/admin", "/fritzi/admin/projets/nouveau")).toBeTruthy();
  });

  it("marks Projects active on a project edit route", () => {
    expect(isNavLinkActive("/fritzi/admin", "/fritzi/admin/projets/my-project")).toBeTruthy();
  });

  it("does not mark Projects active on a content page", () => {
    expect(isNavLinkActive("/fritzi/admin", "/fritzi/admin/pages/home")).toBeFalsy();
  });

  it("marks a content page active on itself", () => {
    expect(isNavLinkActive("/fritzi/admin/pages/home", "/fritzi/admin/pages/home")).toBeTruthy();
  });

  it("does not cross-match two different content pages", () => {
    expect(isNavLinkActive("/fritzi/admin/pages/home", "/fritzi/admin/pages/about")).toBeFalsy();
  });
});
