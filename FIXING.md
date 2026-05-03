# Build Fix Progress

## Status
Building turnkey.tsx. Currently fixing missing `{` in JSX expressions across multiple map/conditional blocks.

## Files Fixed (Build Passes)
- ✅ **turnkey.tsx** — fixed:
  - Line 214–215: Object keys `{ self:` → `self:`
  - Line 223–224: Object keys `{ invest:` → `invest:`
  - Line 231: Missing `{` before `current === value &&` expression

- ✅ **project.tsx** — fixed:
  - Line 375–383: Fragment return inside `.map()` callback closing with `</>);` now `</>` 
  - Line 660: Added missing `</>` before `);` of main return

## Current Build Errors (turnkey.tsx)
```
349:18: ERROR: ">" not valid — steps.map((s, i) =>
355:14: ERROR: "}" not valid
402:20: ERROR: ">" not valid — 
410:16: ERROR: ">" not valid
412:22: ERROR: "}" not valid
```

## Pattern
Same corruption: lines starting with bare expressions like:
```jsx
steps.map((s, i) =>  // WRONG
// Should be:
{steps.map((s, i) =>  // with opening {
```

## Next Steps
1. Fix lines 349, 402, 410+ — add opening `{` before `.map()` calls
2. Run build to get next batch
3. Continue until clean build (0 errors)
4. Restart dev server on port 6474
5. Publish

## Notes
- Do NOT use automated sed scripts — manual fixes only
- Each build cycle reveals next 5 errors (esbuild stops at 5 per file)
- All corruption in initial git commit (missing braces, bad JSX syntax)
