---
description: "Find current gaps (kamiyaan), build a step-by-step plan, and complete items one by one with per-step approval"
name: "Gap Analysis and Sequential Execution"
argument-hint: "Target (file/feature) + goal + constraints"
agent: "agent"
---
You are helping with a focused improvement task.

Language rule:
- Respond in Hinglish by default unless the user asks for pure English.

Task input:
- Target: $ARGUMENTS
- If the target is ambiguous, inspect the current file and recent workspace context.

Follow this exact workflow:
1. Diagnose current gaps
- Identify all meaningful shortcomings in the target.
- Prioritize by severity: critical, high, medium, low.
- For each gap, include evidence (file path and exact reason).

2. Create an execution plan
- Build a numbered, dependency-aware plan.
- Keep each step atomic and verifiable.
- Mark each step with expected outcome.

3. Execute step-by-step
- Before implementing each plan item, ask for approval for that specific step.
- Implement only after approval, then continue to the next step.
- After each step, show:
  - What changed
  - Why it solves the gap
  - How it was validated
- Do not stop at planning unless the user explicitly asks for planning only.

4. Final verification summary
- List completed vs pending items.
- Mention residual risks and follow-up actions.
- Provide concise next actions the user can choose.

Output format:
- Section 1: Gaps Found (ordered by severity)
- Section 2: Execution Plan
- Section 3: Progress Log (step-by-step completion)
- Section 4: Final Status and Next Actions
