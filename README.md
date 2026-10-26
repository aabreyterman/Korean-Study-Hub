# Anastasiia korean studies

A personal Korean study room with flashcards, multiple-choice quizzes, Korean typing practice, chapter notes, Hanja, daily checklists and saved progress.

## Navigation

The left sidebar is the main navigation: Today, My progress, Hanja, Book notes, Vocabulary, and Calendar. Chapter tracking, the study roadmap, and TOPIK goals are grouped under My progress. Word-practice modes appear only inside a study set. On small screens, the sidebar opens from the menu button.

Today puts the five-item checklist first, opens the next unfinished task, and keeps other controls collapsed. Book charts and the compact calendar sit alongside it on desktop and below it on mobile. Backups live in the sidebar rather than above the study plan.

## Daily study

1. Revise 20 random vocabulary cards. The selection changes each Dubai calendar day and remains stable when reopening that day. Words can repeat on future days.
2. Learn **all** vocabulary added yesterday, in a separate unlimited set.
3. Log the Hanja chapters covered.
4. Log a textbook lesson: Grammar → Quiz → Conversation → Vocabulary, in printed order. Individual sections and whole chapters remain available.
5. Type Korean, select its textbook chapter/date, and press Enter to translate and save a personal card.

## Progress and moving from the old address

The owner-approved 26 October 2026 backup is published at `dist/progress/latest.json`. A new browser, or a browser with an older timestamp, restores it automatically. Newer browser progress is kept. Before an automatic replacement, a recovery snapshot is stored under `seoul-study-club-v1-before-published-restore` in localStorage. **Progress & backups** also provides manual import, download, and explicit published-backup restore.

Study progress, newly entered words, corrections and learning history save in localStorage plus an IndexedDB backup on this computer/browser. An optional connected file stores a portable JSON copy. GitHub Pages does not push subsequent personal progress back to GitHub or synchronise devices. To publish another snapshot, replace `dist/progress/latest.json` with an exported backup and commit/push it. Download a backup before changing browsers or clearing site data.

The published snapshot is public by the owner's explicit request. Other standard backup filenames remain ignored; credentials are never shipped.

## Chapters and cards

**Chapter progress** shows Hanja coverage and individual student-book parts. Completed tiles are green; partially completed student chapters are yellow. Click a student chapter to log or undo a part and start its vocabulary quiz, typing test, or flashcards. Hanja chapter buttons open the corresponding book entries; **Test Korean readings** asks for the character's Korean reading and then reveals its meaning.

Book-note dates start collapsed. Custom cards can be edited (including Korean spelling) or deleted from Book notes and the word library. Edits keep stable card IDs and review history. Deleted cards are excluded from study sets but retained in backups and can be restored from **Deleted words**.

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

The original 417 notebook cards and their IDs are preserved. Hanja remains separate from the general vocabulary pool. Book notes are grouped by textbook chapter and study date. `scripts/` contains factual source tables used to validate the Hanja import; no source PDFs are included.
