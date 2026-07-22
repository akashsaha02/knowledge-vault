type HtmlContent = {
  format: "html";
  html: string;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function plainTextToHtml(text: string) {
  if (!text.trim()) return "";
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function tiptapDocToHtml(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const doc = node as {
    type?: string;
    text?: string;
    content?: unknown[];
  };

  if (doc.type === "text" && typeof doc.text === "string") {
    return escapeHtml(doc.text);
  }

  if (!Array.isArray(doc.content)) {
    return "";
  }

  const children = doc.content.map(tiptapDocToHtml).join("");

  switch (doc.type) {
    case "doc":
      return children;
    case "paragraph":
      return children ? `<p>${children}</p>` : "<p><br></p>";
    case "heading": {
      const level = (node as { attrs?: { level?: number } }).attrs?.level ?? 1;
      const tag = `h${Math.min(Math.max(level, 1), 6)}`;
      return `<${tag}>${children}</${tag}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "hardBreak":
      return "<br>";
    default:
      return children;
  }
}

export function contentToHtml(
  content: unknown,
  plainText?: string | null,
): string {
  if (!content) {
    return plainTextToHtml(plainText ?? "");
  }

  if (typeof content === "string") {
    return content;
  }

  if (typeof content === "object" && content !== null) {
    const record = content as Record<string, unknown>;

    if (record.format === "html" && typeof record.html === "string") {
      return record.html;
    }

    if (record.type === "doc") {
      const html = tiptapDocToHtml(content);
      if (html.trim()) return html;
    }
  }

  return plainTextToHtml(plainText ?? "");
}

export function htmlToContent(html: string): HtmlContent {
  return { format: "html", html };
}

export function htmlToPlainText(html: string) {
  if (typeof window === "undefined") {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\u00a0/g, " ").trim();
}
