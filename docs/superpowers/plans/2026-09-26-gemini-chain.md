# Gemini model fallback plan

User request: primary Gemini 3.8 Flash, with Gemini 3.7, 3.5, 3.1 and 2.5 Flash Lite available.
API model discovery confirms all IDs; 3.1 uses stable gemini-3.1-flash-lite.

- Add HTTP-faked regressions for ordered fallbacks, primary success, permanent auth failures and exhaustion.
- Wrap existing per-model Gemini request logic; maintain shared request ID and per-model usage attribution. Configurable CSV fallback list defaults empty for compatibility.
- Run new and existing provider tests, review code, then stage Railway model variables and deploy.
- Verify runtime chain and actual CourseOutlineController generation, not just a short JSON request. No course is saved by the generation-only check.
