/**
 * Input sanitization helpers to ensure safe display and prevent injection attacks
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "'":
          return "&#39;";
        case '"':
          return "&quot;";
        case "&":
          return "&amp;";
        default:
          return char;
      }
    })
    .slice(0, 500); // enforce maximum length
}

/**
 * Escapes characters for Telegram HTML / Markdown mode to avoid parse errors
 */
export function escapeTelegramMarkdown(text: string): string {
  if (!text) return "";
  // Escape special chars in MarkdownV2 or sanitize for standard mode
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export function escapeTelegramHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

