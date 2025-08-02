# Project Instructions – Toddler Animal Outlining Game

## Purpose
This document defines how all AI assistants, developers, and tools should interact with this project.  
The goal is to maintain a clean, readable, and maintainable codebase that a **non-developer** can follow, edit, and extend with AI support.

---

## Mandatory References

Every prompt, code generation, update, or review must first reference the following two files:

- `project-rules.md` → Defines how code should be structured, commented, and tagged with unique IDs.
- `prd.md` → Contains the official product scope, gameplay design, visuals, modes, and technology stack.

If you (the AI or collaborator) are editing, refactoring, or generating new functionality:
- **STOP** unless both files are understood and actively followed.

---

## Prompting Instructions

When using an AI system like ChatGPT with this project:

### Required at the start of every session:
```markdown
Please load and reference `project-rules.md` and `prd.md` from the project root before responding.
All code must follow the readability and commenting standards outlined in `project-rules.md`.