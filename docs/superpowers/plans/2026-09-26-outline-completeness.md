# Complete course outline fix

Evidence: production Groq responses hit 8,192 output tokens; UI displays two chapters
with only one lesson in the second. Frontend maps all received chapters. Controller
accepted any JSON with a chapters key.

- Reproduce incomplete-success bug with HTTP-faked real controller/service tests.
- Increase this endpoint's output budget to 32,768; enforce existing prompt contract
  (4–6 chapters, 3 documents + final quiz each, 3 questions, 4 answers, one correct).
- Let provider retries/model fallbacks handle incomplete response through an optional
  response validator; keep other features unchanged. Revalidate in controller.
- Test partial Gemini, partial Groq, valid output, malformed lesson/quiz, and existing
  provider routing. Review, deploy, then check complete generation on Railway.
- No saved course mutation, migration changes or secret logging.
