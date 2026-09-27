# Outline web timeout fix

Evidence: production requests returned HTTP500 after32/53seconds; matching PHP fatal
logs say Maximum execution time of30 seconds exceeded in Guzzle CurlFactory.
Prior CLI smoke test bypassed the web limit. Browser mapped the interrupted response
to ERR_NETWORK and incorrectly suggested user connectivity was at fault.

- Reproduce absent total deadline in provider tests.
- Scope PHP210s limit to outline endpoint, pass total AI deadline180s through existing
  provider/model retries, cap each HTTP request by remaining time.
- Keep normal90s limit for other callers; revise misleading frontend network text.
- Run regression tests, review, deploy and test authenticated HTTP with an expiring
  diagnostic token; remove only that token. Do not save a course.
