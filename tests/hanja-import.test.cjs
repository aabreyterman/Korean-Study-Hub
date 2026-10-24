const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const deck = JSON.parse(fs.readFileSync(path.join(root, 'dist/hanja.json'), 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, 'scripts/hanja-vocabulary-verified.json'), 'utf8'));
const index = JSON.parse(fs.readFileSync(path.join(root, 'scripts/hanja-index-verified.json'), 'utf8'));
const characters = deck.chapters.flatMap(c => c.characters);

test('all 26 chapters, full character index, and radical chapters are imported', () => {
  assert.equal(deck.audit.importComplete, true);
  assert.equal(deck.chapters.length, 26);
  assert.equal(index.length, 388);
  const imported = new Set(characters.map(c => c.hanja));
  for (const row of index) assert(imported.has(row.hanja), row.hanja);
  for (const radical of '宀氵亻艹艸辶辵灬') assert(imported.has(radical), radical);
  assert(deck.chapters[24].characters.length > 30);
  assert(deck.chapters[25].characters.length > 30);
});

test('every explicit source vocabulary row has an associated card and printed page', () => {
  const occurrences = new Set(characters.flatMap(c => c.vocabulary.map(v => `${v.page}|${v.korean}|${v.hanja}`)));
  for (const row of source) assert(occurrences.has(`${row.page}|${row.korean}|${row.hanja}`), JSON.stringify(row));
  assert.equal(deck.audit.vocabularyEntries, source.length);
  assert.equal(deck.audit.unassignedVocabulary, 0);
  for (const c of characters) {
    assert(c.reading && c.meaning && c.koreanMeaning && c.page > 0, c.hanja);
    assert(/[a-z]/i.test(c.meaning), c.hanja);
    for (const v of c.vocabulary) assert(v.sourceId && v.page >= 19 && v.page <= 170 && v.meaning, v.korean);
  }
});

test('root IDs are unique; repeated primary roots remain in later book chapters', () => {
  assert.equal(new Set(characters.map(c => c.id)).size, characters.length);
  for (const c of deck.chapters) assert.equal(new Set(c.characters.map(x => x.hanja)).size, c.characters.length);
  for (const [chapter, roots] of [[14,'教學放'], [17,'家動'], [19,'大文放'], [24,'學']]) {
    for (const h of roots) assert(deck.chapters[chapter-1].characters.some(c => c.hanja === h), `${chapter}:${h}`);
  }
});

test('split labels, top rows, and mixed-script OCR corrections survive rebuilding', () => {
  for (const word of ['양로원','춘곤증','체육관','석식','석양','추석','농담','상담','2호선','국화','임야','호명','열']) {
    assert(source.some(v => v.korean === word), word);
  }
  assert(source.some(v => v.korean === '자신' && v.hanja === '自信' && v.meaning === 'self-confidence'));
  assert(index.some(r => r.hanja === '反'));
  assert(!index.some(r => r.hanja === '返'));
});
