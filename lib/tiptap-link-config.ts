import type { LinkOptions } from "@tiptap/extension-link";

type IsAllowedUriContext = Parameters<
  NonNullable<LinkOptions["isAllowedUri"]>
>[1];

const DISALLOWED_PROTOCOLS = ["ftp", "file", "mailto"];
const DISALLOWED_DOMAINS = ["example-phishing.com", "malicious-site.net"];
const NO_AUTOLINK_DOMAINS = ["example-no-autolink.com", "another-no-autolink.com"];

export const tiptapLinkConfig: Partial<LinkOptions> = {
  openOnClick: false,
  autolink: true,
  defaultProtocol: "https",
  protocols: ["http", "https"],
  isAllowedUri: (url: string, ctx: IsAllowedUriContext) => {
    try {
      const parsedUrl = url.includes(":")
        ? new URL(url)
        : new URL(`${ctx.defaultProtocol}://${url}`);

      if (!ctx.defaultValidate(parsedUrl.href)) {
        return false;
      }

      const protocol = parsedUrl.protocol.replace(":", "");
      if (DISALLOWED_PROTOCOLS.includes(protocol)) {
        return false;
      }

      const allowedProtocols = ctx.protocols.map((p) =>
        typeof p === "string" ? p : p.scheme
      );
      if (!allowedProtocols.includes(protocol)) {
        return false;
      }

      if (DISALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },
  shouldAutoLink: (url: string) => {
    try {
      const parsedUrl = url.includes(":")
        ? new URL(url)
        : new URL(`https://${url}`);
      return !NO_AUTOLINK_DOMAINS.includes(parsedUrl.hostname);
    } catch {
      return false;
    }
  },
};
