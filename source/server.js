import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" })); 

const USER_ID = process.env.USER_ID || "john_doe_17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

const isIntegerString = (s) => /^[+-]?\d+$/.test(s);    
const isAlphaOnly    = (s) => /^[A-Za-z]+$/.test(s);
const isSpecialChar  = (s) => s.length === 1 && !isIntegerString(s) && !isAlphaOnly(s);    


function normalizeCandidate(value) {
  if (typeof value === "number") {
    if (Number.isFinite(value) && Number.isInteger(value)) {
      return value.toString(); 
    }
    return null;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null; 
    if (isIntegerString(s) || isAlphaOnly(s)) return s;
    return null;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  return null;
}

app.post("/bfhl", (req, res) => {
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

  if (!rawArray) {
    return res.status(200).json(base);
  }

  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0n;

  for (const item of rawArray) {
    const token = normalizeCandidate(item);
    if (token === null) continue;

    if (isIntegerString(token)) {
      const n = BigInt(token);
      sum += n;
      (n % 2n === 0n ? even_numbers : odd_numbers).push(token); 
    } else if (isAlphaOnly(token)) {
      alphabets.push(token.toUpperCase());
    } else if (typeof item === "string" && isSpecialChar(item)) {
      special_characters.push(item);
    }
  }

  const concat_string = alphabets.map((char, index) => 
    index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
  ).reverse().join("");

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
});

app.get("/bfhl", (req, res) => {
  return res.status(200).json({
    operation_code: 1
  });
});

app.get("/", (_req, res) => res.send("OK"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
