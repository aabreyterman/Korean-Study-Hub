'use strict';
// Alias rows are consumed once. Summed counters and the latest explicit decision survive.
window.migrateStudyProgress=(state,words)=>{
 const mapping=new Map();for(const w of words){mapping.set(w.id,w.id);for(const id of w.legacyIds||[])mapping.set(id,w.id)}
 let changed=false;const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
 state.learned=state.learned||{};state.practice=state.practice||{};
 for(const w of words){const ids=[...new Set([w.id,...w.legacyIds||[]])];const aliases=ids.filter(id=>id!==w.id&&(own(state.learned,id)||own(state.practice,id)));
  if(!aliases.length)continue;changed=true;
  const present=ids.filter(id=>own(state.learned,id)||own(state.practice,id));
  const candidates=present.map(id=>({id,p:state.practice[id],hasMark:own(state.learned,id),mark:state.learned[id],time:Date.parse(state.practice[id]?.lastAt||'')||0}));
  const marks=candidates.filter(c=>c.hasMark).sort((a,b)=>b.time-a.time||(a.mark===false?-1:b.mark===false?1:0));
  if(marks.length)state.learned[w.id]=marks[0].mark;
  const ps=candidates.filter(c=>c.p);if(ps.length){const latest=[...ps].sort((a,b)=>b.time-a.time)[0];const history=ps.flatMap(c=>c.p.history||[]).sort((a,b)=>(Date.parse(a.at)||0)-(Date.parse(b.at)||0));
   state.practice[w.id]={known:ps.reduce((n,c)=>n+(c.p.known||0),0),again:ps.reduce((n,c)=>n+(c.p.again||0),0),forgotten:ps.reduce((n,c)=>n+(c.p.forgotten||0),0),lastAction:latest.p.lastAction,lastAt:latest.p.lastAt,history:history.slice(-100)};
  }
  for(const id of aliases){delete state.learned[id];delete state.practice[id]}
 }
 const mapped=id=>mapping.get(id)||id;
 const nextMistakes=[...new Set((state.mistakes||[]).map(mapped))];if(JSON.stringify(nextMistakes)!==JSON.stringify(state.mistakes||[]))changed=true;state.mistakes=nextMistakes;
 for(const [date,ids] of Object.entries(state.daily||{})){const next=[...new Set(ids.map(mapped))];if(JSON.stringify(next)!==JSON.stringify(ids))changed=true;state.daily[date]=next}
 return changed;
};
