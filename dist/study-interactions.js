'use strict';
window.createStudySaveQueue=({write,requestFrame=callback=>window.requestAnimationFrame(callback),defer=callback=>setTimeout(callback,0)})=>{let dirty=false,scheduled=false;function flush(){if(!dirty)return;dirty=false;write()}function schedule(){dirty=true;if(scheduled)return;scheduled=true;requestFrame(()=>defer(()=>{scheduled=false;flush()}))}return{schedule,flush}};
window.StudyViews=(()=>{
 let related=new Map();const key=w=>w.hanjaRef||w.studyRef?.kind==='grammar'?'id:'+w.id:'word:'+w.korean.normalize('NFKC').replace(/[\s\p{P}]/gu,'').toLowerCase();
 function index(words){related=new Map();for(const w of words){const k=key(w);if(!related.has(k))related.set(k,[]);related.get(k).push(w.id)}}
 function recover(state,words){let changed=false;const valid=new Set(words.map(w=>w.id)),days=new Map();for(const ids of Object.values(state.daily||{}))for(const id of new Set(ids))if(valid.has(id))days.set(id,(days.get(id)||0)+1);state.practice||={};for(const id of new Set([...Object.keys(state.practice),...days.keys()])){if(!valid.has(id))continue;const p=state.practice[id]||{known:0,again:0,forgotten:0,history:[]},seen=Math.max(Number.isSafeInteger(p.seen)?p.seen:0,(p.known||0)+(p.again||0),days.get(id)||0);if(p.seen!==seen){p.seen=seen;state.practice[id]=p;changed=true}}index(words);return changed}
 function summary(state,w){const ids=related.get(key(w))||[w.id];return ids.reduce((out,id)=>{const p=state.practice[id]||{};for(const field of['known','again','forgotten'])out[field]+=p[field]||0;out.seen+=Math.max(p.seen||0,(p.known||0)+(p.again||0));return out},{known:0,again:0,forgotten:0,seen:0})}
 function seen(state,w){const p=state.practice[w.id]||{known:0,again:0,forgotten:0,history:[]};p.seen=(p.seen||0)+1;p.lastSeenAt=new Date().toISOString();state.practice[w.id]=p}
 return{index,recover,summary,seen};
})();
