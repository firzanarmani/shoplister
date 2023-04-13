import {
  char,
  charIn,
  createRegExp,
  digit,
  exactly,
  letter,
} from "magic-regexp";

export const UPPERCASE_PATTERN = createRegExp(
  exactly("").before(char.times.any().and(letter.uppercase))
);

export const LOWERCASE_PATTERN = createRegExp(
  exactly("").before(char.times.any().and(letter.lowercase))
);

export const ALLOWED_CHARS_PATTERN = createRegExp(
  exactly("")
    .and(letter.or(digit.or(charIn("!@#$%^&*"))).times.any())
    .at.lineStart()
    .at.lineEnd()
);
