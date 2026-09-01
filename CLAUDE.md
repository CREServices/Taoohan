# Commit & Push Hygiene Rules

This is a Claude Code / AI-agent-driven repository. All commits must follow strict hygiene rules.

## RULE 1 — SINGLE AUTHOR IDENTITY (GENE ONLY)

- The ONLY author/committer that may appear in git history is **Gene**.
- Always configure and use:
  ```
  git config user.name "Gene"
  git config user.email "<GENE_EMAIL>"
  ```
- Never commit under any other name or email.
- No other person may appear as author, committer, or co-author — ever.

## RULE 2 — NO AI / CLAUDE TRACE

- NEVER add AI attribution to commits or code. Forbidden anywhere:
  - "Co-Authored-By: Claude ..." trailers
  - "Generated with Claude Code" / any "Generated with ..." line
  - Any mention of Claude, AI, assistant, LLM, bot, or automated tooling
- Every commit must read as if written by a human developer (Gene).
- Commit messages should sound natural and human — no AI-sounding boilerplate.

## RULE 3 — NO INTERNAL / TASKING TRACE

- Strip anything revealing internal workflow or outsourcing before committing.
- Forbidden in committed code, comments, or messages (case-insensitive):
  - "Developer 1", "Developer 2", "dev 1", "dev 2", "developer"
  - Any personal name other than Gene
  - Task-assignment, handoff, or internal instruction notes
- Before each commit, scan staged changes for these terms and clean them.

## RULE 4 — EXCLUDE NON-SOURCE FILES

Never commit or push non-source/internal files. See `.gitignore` for current patterns:
- Documents: *.pdf, *.doc, *.docx, *.rtf, *.odt
- Planning/slides: *.ppt, *.pptx, *.xls, *.xlsx
- Transcription files and scripts
- AI/internal docs: `.claude/`, `.qodo/`, `.beads/`, `LOOP.md`, `STATE.md`, loop-*.md, milestone2-deck/, raw-assets/

Only actual source code and required config files may be pushed.

## RULE 5 — FRESH PUSH / TIMESTAMP HYGIENE

Every push goes through `fresh-push.sh`, never a raw `git push`:
- Rewrite commit metadata so history stays clean (Gene author only)
- Strip any AI co-author / "Generated with" / bot lines from messages
- Refresh commit dates with natural spread (files show recent activity, not identical timestamps)
- Force-push the current branch after rewriting

## PRE-PUSH CHECKLIST

Before running `fresh-push.sh`:
- [ ] Author + committer = Gene only (verify via `git log`)
- [ ] No Claude / AI / "Generated with" trace in commits or messages
- [ ] No "Developer 1/2", other personal names, or tasking notes anywhere
- [ ] No doc/pdf/transcription/planning/AI-internal files staged or tracked
- [ ] .gitignore covers all excluded patterns
- [ ] Commit messages sound human and natural
- [ ] Commit timestamps look recent and naturally spread

## Usage

```bash
./fresh-push.sh
```

All rules are HARD requirements. If any staged change or existing commit violates a rule, fix it BEFORE pushing.
