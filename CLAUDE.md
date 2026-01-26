# CLAUDE.md - AI Assistant Guidelines

This document provides guidance for AI assistants (like Claude) working with this repository.

## Repository Overview

**Repository:** Claude-code
**Purpose:** Claude Code test repository
**Status:** Initial setup - minimal codebase
**Primary Branch:** `main`

## Current State

This repository is in its initial state with minimal content:

```
Claude-code/
├── .git/              # Git version control
├── README.md          # Project description
└── CLAUDE.md          # This file - AI assistant guidelines
```

## Development Guidelines

### Git Workflow

1. **Branch Naming Convention:**
   - Feature branches: `claude/<feature-name>-<session-id>`
   - Bug fixes: `fix/<description>`
   - Improvements: `improve/<description>`

2. **Commit Messages:**
   - Use clear, descriptive commit messages
   - Start with a verb (Add, Fix, Update, Remove, Refactor)
   - Keep the first line under 72 characters
   - Example: `Add user authentication module`

3. **Before Pushing:**
   - Ensure all changes are committed
   - Verify you're on the correct branch
   - Use `git push -u origin <branch-name>`

### Code Standards (For Future Development)

When adding code to this repository, follow these conventions:

#### General Principles
- Write clean, readable, self-documenting code
- Follow the DRY (Don't Repeat Yourself) principle
- Prefer simplicity over complexity
- Add comments only where logic isn't self-evident

#### File Organization
- Group related files in logical directories
- Use descriptive file and directory names
- Keep configuration files at the root level

#### Testing
- Write tests for new functionality
- Ensure existing tests pass before pushing
- Place tests in a dedicated `tests/` or `__tests__/` directory

### Working with This Repository

#### For AI Assistants

1. **Before Making Changes:**
   - Read existing files to understand context
   - Check the current git status and branch
   - Understand the scope of requested changes

2. **When Implementing Features:**
   - Start with the simplest solution that works
   - Avoid over-engineering or adding unnecessary abstractions
   - Don't add features beyond what was requested

3. **Code Quality:**
   - Follow existing code style and conventions
   - Don't introduce security vulnerabilities
   - Keep changes focused and minimal

4. **Documentation:**
   - Update this CLAUDE.md when project structure changes significantly
   - Keep README.md current with project status
   - Document non-obvious design decisions

## Project Setup (Future)

When this repository grows to include actual code, update this section with:

- [ ] Language and framework being used
- [ ] Installation instructions
- [ ] Environment setup
- [ ] Build commands
- [ ] Test commands
- [ ] Deployment process

## Common Tasks

### Getting Started
```bash
# Clone the repository
git clone <repository-url>
cd Claude-code

# Check current status
git status
git branch -a
```

### Making Changes
```bash
# Create a new branch
git checkout -b <branch-name>

# Stage and commit changes
git add <files>
git commit -m "Descriptive commit message"

# Push changes
git push -u origin <branch-name>
```

## Repository Contacts

- **Owner:** AknightBeechfield
- **Primary Email:** alex.knight@beechfield.com

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-26 | 0.1.0 | Initial repository setup |
| 2026-01-26 | 0.1.1 | Added CLAUDE.md guidelines |

---

*This document should be updated as the repository evolves. AI assistants should reference this file when working on the codebase.*
