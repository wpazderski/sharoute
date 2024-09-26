import "server-only";
import sanitizeHtml from "sanitize-html";

const options: sanitizeHtml.IOptions = {
    allowedTags: [
        "address",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "div",
        "hr",
        "li",
        "main",
        "ol",
        "p",
        "pre",
        "ul",
        "a",
        "abbr",
        "b",
        "br",
        "code",
        "em",
        "i",
        "mark",
        "s",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "u",
        "wbr",
    ],
    nonBooleanAttributes: sanitizeHtml.defaults.nonBooleanAttributes,
    disallowedTagsMode: "discard",
    allowedAttributes: {
        "a": ["href", "name", "target", "rel"],
        "img": ["src", "srcset", "alt", "title", "width", "height", "loading"],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "*": ["style"],
    },
    selfClosing: sanitizeHtml.defaults.selfClosing,
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: sanitizeHtml.defaults.allowedSchemesAppliedToAttributes,
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    parseStyleAttributes: true,
};

export function sanitizeRichTextHtml<T extends string>(html: T): T {
    return sanitizeHtml(html, options) as T;
}
