const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const words=JSON.parse(fs.readFileSync('dist/words.json'));
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/progress-migration.js','utf8'),ctx);
const migrate=ctx.window.migrateStudyProgress;
const base=()=>({learned:{},practice:{},mistakes:[],daily:{},plan:{}});
test('family merge sums counts, retains latest decision and maps study references',()=>{
 const s=base();s.learned={'기억':true,'기억하다':false};
 s.practice={'기억':{known:4,again:1,forgotten:1,lastAction:'known',lastAt:'2026-10-15T10:00:00Z',history:[{action:'known',at:'2026-10-15T10:00:00Z'}]},'기억하다':{known:2,again:3,forgotten:2,lastAction:'again',lastAt:'2026-10-16T10:00:00Z',history:[{action:'again',at:'2026-10-16T10:00:00Z'}]}};
 s.mistakes=['기억하다'];s.daily={'2026-10-16':['기억','기억하다']};
 assert.equal(migrate(s,words),true);assert.equal(s.learned['기억'],false);
 assert.equal(s.practice['기억'].known,6);assert.equal(s.practice['기억'].again,4);assert.equal(s.practice['기억'].forgotten,3);assert.equal(s.practice['기억'].history.length,2);
 assert.equal(s.practice['기억'].lastAction,'again');assert.equal(s.practice['기억하다'],undefined);
 assert.equal(s.mistakes.join(','),'기억');assert.equal(s.daily['2026-10-16'].join(','),'기억');
 const after=JSON.stringify(s);assert.equal(migrate(s,words),false);assert.equal(JSON.stringify(s),after);
});
test('undated conflicting older marks remain still learning',()=>{const s=base();s.learned={'기억':true,'기억하다':false};migrate(s,words);assert.equal(s.learned['기억'],false)});
test('latest learned judgement wins even when it is on removed alias',()=>{const s=base();s.learned={'기억':false,'기억하다':true};s.practice={'기억':{lastAt:'2026-10-15',again:1},'기억하다':{lastAt:'2026-10-16',known:2}};migrate(s,words);assert.equal(s.learned['기억'],true);assert.equal(s.practice['기억'].known,2)});
test('backup restore accepts legacy ids before migration, including old version 1',()=>{
 const source=fs.readFileSync('dist/app.js','utf8');const restore=source.slice(source.indexOf('function restoreState('),source.indexOf('const storage='));
 const c={window:ctx.window,words,relationGroups:[],state:base(),migrationPerformed:false,localStorage:{setItem(){}},KEY:'test'};vm.createContext(c);vm.runInContext(restore,c);
 c.restoreState({app:'seoul-study-club',version:1,state:{...base(),learned:{'기억하다':true},exam:'2026-10-17'}});
 assert.equal(c.state.learned['기억'],true);assert.equal(c.state.learned['기억하다'],undefined);
});
