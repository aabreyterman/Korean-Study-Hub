# Anastasiia korean studies

A personal Korean study room with flashcards, multiple-choice quizzes, Korean typing practice, chapter notes, Hanja, daily checklists and saved progress.

## Language and daily Korean

The EN / 한국어 control switches the interface without rebuilding the active view, changing card meanings, or clearing draft inputs. The choice is saved locally under `anastasiia-study-language`. Interface translations are bundled locally; no text is sent to a translation API for this switch. Study answers, original notebook content and learner notes stay in their original language.

Two compact Korean lines show a friendly daily fortune and a common proverb. They rotate deterministically by the Dubai calendar date and stay the same when the page is reopened that day. Click the Korean fortune or quote to reveal or hide its matching English translation. The translation is bundled with each proverb and remains English in Korean interface mode. The browser icon is a local SVG Korean flag.

## Navigation

The left sidebar is the main navigation: Today, My progress, Hanja, Book notes, Rules, Grammar structures, Vocabulary, and Calendar. Chapter tracking, the study roadmap, and TOPIK goals are grouped under My progress. Word-practice modes appear only inside a study set. On small screens, the sidebar opens from the menu button.

Today puts the five-item checklist first, opens the next unfinished task, and keeps other controls collapsed. Book charts and the compact calendar sit alongside it on desktop and below it on mobile. Backups live in the sidebar rather than above the study plan.

## Daily study

1. Revise 20 random vocabulary cards. A fresh Fisher–Yates draw samples unique Korean spellings without a date-derived seed or difficulty priority. The selection is saved for each Dubai calendar day; reopening does not reroll it, and words may repeat on later days.
2. Review all vocabulary from the most recent earlier addition date, even after skipped days, in a separate unlimited set.
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

## Vocabulary groups and word webs

Vocabulary opens an overview with stats and separate TOPIK I, Korean Made Easy, All words mixed, and Latest added pages. The original notebook deck stays in TOPIK I. Chapter notes and later additions belong to Korean Made Easy; Hanja is excluded from these groups. Topic cards open their own flashcards, quiz, typing practice or word list. Each topic page has an Add words button with its category preselected; saving refreshes the list and keeps the form ready for another word. Add or rename categories in the vocabulary overview and change a book word’s category in its topic/word list. A category choice overrides the initial chapter/lesson grouping. Latest added follows the Dubai date of creation for new cards and the study date for older cards.

The daily entry form can save a word to a selected category or route a rule/grammar explanation to its own reference section, keeping the chapter, lesson and study date. New categories, assignments and reference entries use the existing browser and connected-file backup.

Hanja → Word web offers an authored selector for image-based webs. The first web reproduces all 24 pictured words around 한 and 국. Select a root, guess or reveal a branch word, then explore its connected words. Recall results save independently of vocabulary counters and chapter completion. Add future image transcriptions to the `webs` dataset in `dist/word-web.js`; these words never enter the general vocabulary pool automatically.

## Weekly rest and responsive reviews

One streak freeze is available each Monday–Sunday week. The requested 28 October 2026 rest day is seeded once. Calendar days can use, remove or move that week’s freeze; the compact calendar shows a snowflake. A freeze bridges the streak without adding study minutes or increasing the actual study-day total. These settings survive backups, and removing the seeded day does not re-add it on refresh.

Seen counts include each card presentation in a study pass, including cards skipped without revealing the back. Flipping or judging the same card does not double-count that presentation. A migration recovers minimum views from saved daily logs and judgment totals; identical Korean spellings can share displayed history across source groups while their learned marks remain separate. Known/again/forgotten counters retain their actual values.

Flashcard clicks update the card without rebuilding navigation or recomputing the full review pool. Save requests coalesce until after the next paint; browser progress flushes synchronously on page hide or when the document becomes hidden, with the existing IndexedDB and connected-file backup continuing afterward.
