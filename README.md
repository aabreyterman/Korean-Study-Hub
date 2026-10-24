# Anastasiia korean studies

A personal Korean study room with flashcards, multiple-choice quizzes, Korean typing practice, chapter notes, Hanja, daily checklists and saved progress.

## Daily study

1. Revise 20 random vocabulary cards. The selection changes each Dubai calendar day and remains stable when reopening that day. Words can repeat on future days.
2. Learn **all** vocabulary added yesterday, in a separate unlimited set.
3. Log the Hanja chapters covered.
4. Log a textbook lesson: Grammar → Quiz → Conversation → Vocabulary, in printed order. Individual sections and whole chapters remain available.
5. Type Korean, select its textbook chapter/date, and press Enter to translate and save a personal card.

## Progress and moving from the old address

Open the new site and select **Restore latest backup**. Choose the most recent `seoul-study-progress` JSON file. Reconnect the progress file for automatic disk backups if desired. Site addresses have separate browser storage, so the one-time restore is necessary when moving from the old site.

Study progress, newly entered words, corrections and learning history save in localStorage plus an IndexedDB backup on this computer/browser. An optional connected file stores a portable JSON copy. GitHub Pages hosts the application; it does **not** synchronise personal progress between devices or commit personal vocabulary to the repository. Download a backup before changing browsers or clearing site data.

Personal progress files must never be committed. `.gitignore` excludes the standard backup filenames. No personal progress seed or credentials are shipped.

## Translation

The form uses the [MyMemory GET API](https://mymemory.translated.net/doc/spec.php), with no API key. Only the submitted Korean word/phrase is sent. [Anonymous usage is limited to 5,000 characters per day](https://mymemory.translated.net/doc/usagelimits.php). Existing exact study vocabulary is reused when possible. Machine translations may be imperfect: meanings can be corrected in Book notes, and manual entry works when the API is unavailable or limited. English and Russian targets are supported.

Korean pronunciation uses an available Korean text-to-speech voice on the computer.

## GitHub Pages

Publish this repository to GitHub, then choose **Settings → Pages → Source: GitHub Actions**. The included workflow tests the project and deploys only `dist/` on pushes to `main`. Source tables, tests and README are not deployed.

See [GitHub Pages publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Local development

No installation or build step is needed.

```sh
python3 -m http.server 8765 --directory dist
node --test tests/*.test.cjs
```

The original 417 notebook cards and their IDs are preserved. Hanja remains separate from the general vocabulary pool. Book notes are grouped by textbook chapter and study date. `scripts/` contains factual source tables used to validate the Hanja import; no source PDFs or private progress backups are included.
