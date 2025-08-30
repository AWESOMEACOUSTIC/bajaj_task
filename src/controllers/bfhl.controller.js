import { USER_ID, EMAIL, ROLL_NUMBER, isIntegerString, isAlphaOnly, isSpecialChar, normalizeCandidate } from "../utils/classifiers.js";

export function processBfhl(req, res) {
  const body = req.body ?? {};
  const rawArray = Array.isArray(body.data) ? body.data : null;

  const base = {
    is_success: false,
    user_id: USER_ID,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    odd_numbers: [],
    even_numbers: [],
    alphabets: [],
    special_characters: [],
    sum: "0",
    concat_string: ""
  };

  if (!rawArray) return res.status(200).json(base);

  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0n;

  for (const item of rawArray) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed.length === 1) {
        if (isIntegerString(trimmed)) {
          const n = BigInt(trimmed); sum += n; (n % 2n === 0n ? even_numbers : odd_numbers).push(trimmed);
        } else if (isAlphaOnly(trimmed)) {
          alphabets.push(trimmed.toUpperCase());
        } else {
          special_characters.push(trimmed);
        }
        continue;
      }
      if (isIntegerString(trimmed)) {
        const n = BigInt(trimmed); sum += n; (n % 2n === 0n ? even_numbers : odd_numbers).push(trimmed);
      } else if (isAlphaOnly(trimmed)) {
        alphabets.push(trimmed.toUpperCase());
      }
      continue;
    }

    const token = normalizeCandidate(item);
    if (token !== null) {
      if (isIntegerString(token)) {
        const n = BigInt(token); sum += n; (n % 2n === 0n ? even_numbers : odd_numbers).push(token);
      } else if (isAlphaOnly(token)) {
        alphabets.push(token.toUpperCase());
      } else if (isSpecialChar(token)) {
        special_characters.push(token);
      }
    }
  }

  const reversedAlphabets = alphabets.slice().reverse();
  const concat_string = reversedAlphabets.map((char, index) => index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()).join("");

  return res.status(200).json({
    ...base,
    is_success: true,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: sum.toString(),
    concat_string
  });
}

export function getOperation(req, res) {
  return res.status(200).json({ operation_code: 1 });
}

export function health(req, res) {
  return res.json("Server is running");
}
