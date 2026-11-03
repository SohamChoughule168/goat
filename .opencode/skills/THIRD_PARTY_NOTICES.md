# Third-Party Skill Notices

Installed project-local skills for `D:\goat` on 2026-10-31. The third-party
skill folders were copied from the repositories and commits below, except for
one frontmatter description adaptation noted under `3d-website-architect`.
Each installed third-party skill folder includes the source repository's MIT
`LICENSE`. Additional license copies are in `_licenses/`.

## Installed third-party skills

### 3d-website-architect

- Source: https://github.com/deveshpunjabi/3d-website-skill
- Commit: `98f4cd4bfdf4cbb87c0f40d59d681158c490e9a5`
- License: MIT
- Copyright: 2026 Devesh Punjabi
- Installed path: `3d-website-architect/`
- Adaptation: the `SKILL.md` frontmatter `description` was shortened from
  1106 to 731 characters to satisfy OpenCode's 1024-character limit. The skill
  body and all other files are unchanged.

### ai-ui-ux-motion-engine

- Source: https://github.com/OpaceDigitalAgency/ai-ui-ux-motion-engine
- Commit: `c656647a82617b06095a88d6928678d0252e1691`
- License: MIT
- Copyright: 2026 David Bryan / Opace
- Installed path: `ai-ui-ux-motion-engine/`
- Note: optional repository scripts may call external tools such as the
  `higgsfield` CLI. They were not run, and no paid service or credits were
  configured. The skill's own scripts were inspected for local validation and
  media tooling only.

### Joey-1123/opencode-v2-skills

- Source: https://github.com/Joey-1123/opencode-v2-skills
- Commit: `caeaa541a35153b06c1503419baa234fda2fc6a2`
- License: MIT
- Copyright: 2026 Joey-1123
- Installed skills:
  - `react-three-fiber/`
  - `gsap-scrolltrigger/`
  - `lottie-animations/`
  - `rive-interactive/`
  - `spline-interactive/`
  - `lightweight-3d-effects/`
  - `web3d-integration-patterns/`
  - `animated-component-libraries/`
- Upstream collection note: this repository's README attributes 22 skills to
  https://github.com/freshtechbro/claudedesignskills (MIT, Copyright 2025
  Claude Skills Project) and 3 skills to original work. The upstream MIT
  notice is included as `_licenses/freshtechbro-claudedesignskills-LICENSE`.
- Not installed: the repository's `install.sh`, `plugins/skill-manager.js`,
  and `npm-package/bin/cli.js`. These use recursive copying, `execSync`, and
  package installation; they were not run.

## Audited but not installed

### JustineBijuPaul/frontend-ai-skills

- Source: https://github.com/JustineBijuPaul/frontend-ai-skills
- Commit: `f52d23c5b8f51caefccb97ea2bc88f6db7bc6120`
- License: MIT (Copyright 2026 Justine Biju Paul)
- Decision: not installed. The reviewed skills (including `41-threejs` and
  `70-frontend-skill-router`) are templated and thin: they share the same
  generic implementation-contract and quality-checklist boilerplate, with
  little skill-specific technical guidance. No files were copied.

### anurag-panda-dev/opencode-skills

- Source: https://github.com/anurag-panda-dev/opencode-skills
- Commit: `6e4a569c9ef24b47666edc88b6e0643b239a33eb`
- License: none found
- Decision: not installed and not copied. Link-only reference.

### adrianhajdin/gsap_macbook_landing

- Source: https://github.com/adrianhajdin/gsap_macbook_landing
- Commit: `5312059f07a5311503927158f87c984962b40f44`
- License: none found
- Decision: not installed and not copied. Link-only reference project.

## Original project content

`premium-creative-web-engineering/` is original project content created for
this installation. It routes to the installed and existing skills and does not
copy third-party source code.

## License files

- `_licenses/deveshpunjabi-3d-website-skill-LICENSE`
- `_licenses/OpaceDigitalAgency-ai-ui-ux-motion-engine-LICENSE`
- `_licenses/Joey-1123-opencode-v2-skills-LICENSE`
- `_licenses/freshtechbro-claudedesignskills-LICENSE`

## Upstream skill-name mapping

`web3d-integration-patterns` mentions names from its original collection. They
are mapped, not edited, in `premium-creative-web-engineering/SKILL.md`:

- `threejs-webgl` -> `webgl-threejs`
- `motion-framer` -> `motion-dev`
- `react-spring-physics` -> Motion springs in `motion-dev` (do not add React
  Spring unless the project already needs it)
