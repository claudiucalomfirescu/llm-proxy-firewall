# llm-proxy-firewall explainer video: script

Video: [../firewall-explainer.mp4](../firewall-explainer.mp4) · 65 s · 1920×1080 · 30 fps · no audio ·
Remotion, all scenes in [`src/Composition.tsx`](src/Composition.tsx). Every message, rationale, reference
and number comes from the recorded demo week (`demo/data/demo.db`, recorded 2026-11-13) and is copied
into [`src/real.ts`](src/real.ts); `public/dashboard.png` is a real screenshot of `dashboard/server.py --demo`
(dark theme) with omar's T-322 session open.

Re-render:
```bash
cd explainers/video && npm ci
npx remotion render FirewallExplainer out/raw.mp4 --browser-executable=/opt/pw-browsers/chromium
ffmpeg -i out/raw.mp4 -c:v libx264 -crf 31 -tune animation -pix_fmt yuv420p -movflags +faststart ../firewall-explainer.mp4
```

| # | Time | Scene | On screen |
|---|---|---|---|
| 1 | 0:00–0:04 | Title | Shield, name, "An LLM logging proxy with a policy firewall". |
| 2 | 0:04–0:11 | The problem | Three real requests (Maya's password, Lena's leads to Gmail, Omar's insult). "The LLM provider enforces its rules, not yours." |
| 3 | 0:11–0:18 | One change | agents → proxy + firewall → provider; `base_url = "http://127.0.0.1:8080/v1"`. |
| 4 | 0:18–0:28 | The checkpoint | Keyword rules, co-occurrence rules, LLM intent check; info / warning / block. |
| 5 | 0:28–0:40 | A real block | Lena's request typed; rules: warning; judge: block with its rationale; provider not called; the block message with FW-49E2A270. |
| 6 | 0:40–0:52 | Who wrote it matters | The customer's angry ticket read by Omar's agent: warning, session stays open. Lena asking for a threatening email: block, FW-BDA5726D. |
| 7 | 0:52–1:00 | The audit trail | Dashboard screenshot zooming into the findings table; 56 calls, 12 intent checks, 8 blocked, 6 sessions closed, $0.0006. |
| 8 | 1:00–1:05 | Outro | "A tripwire with an audit trail", the blueprint, the repo URL. |
