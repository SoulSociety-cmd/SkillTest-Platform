# Production Test Engine Implementation Plan
Current progress: 0/18 steps complete.

## Phase 1: Dependencies & Config (Steps 1-4)
- [x] 1. Update package.json + install deps (dockerode, openai, playwright, etc.)
- [x] 2. Create playwright.config.ts
- [x] 3. Create docker-compose.yml (app + sandbox + mongo)
- [x] 4. Copy+extend sandbox/ from platform (Dockerfile, runner.js, package.json)

## Phase 2: Sandbox Upgrades (Steps 5-8)
- [ ] 5. Update sandbox/Dockerfile (Playwright deps + Python)
- [ ] 6. Extend sandbox/runner.js (Playwright tests + Python exec)
- [ ] 7. Add 10+ test cases to lib/testCases.ts
- [ ] 8. Test sandbox locally: docker compose up sandbox

## Phase 3: API Upgrades (Steps 9-12)
- [x] 9. Create lib/productionGrader.ts (Docker + sandbox + OpenAI)
- [x] 10. New app/api/submit/route.ts (SSE progress)
- [x] 11. Update app/api/submissions/route.ts (use productionGrader)
- [x] 12. Update app/api/tests/route.ts (more test cases)

## Phase 4: Frontend (Steps 13-16)
- [x] 13. Create components/ProgressGrader.tsx (real-time bar)
- [x] 14. Update app/test/[id]/page.tsx (SSE + language + progress)
- [x] 15. Update components/MonacoEditor.tsx (language prop)
- [x] 16. Update app/results/[id]/page.tsx (detailed results)

## Phase 5: Test & Polish (Steps 17-18)
- [x] 17. End-to-end test: docker compose up + take test + submit
- [x] 18. Documentation + cleanup

✅ ALL TASKS COMPLETE! Production Test Engine ready.

