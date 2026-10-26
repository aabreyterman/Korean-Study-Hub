'use strict';
window.ProgressSeed=(()=>{
 const valid=s=>s?.app==='seoul-study-club'&&s.version===2&&s.state&&Number.isFinite(s.state.updatedAt)&&Array.isArray(s.state.customWords);
 function shouldRestore(current,backup){return valid(backup)&&(!Number.isFinite(current?.updatedAt)||backup.state.updatedAt>current.updatedAt)}
 async function load(){const r=await fetch('progress/latest.json',{cache:'no-store'});if(!r.ok)throw Error('Published backup unavailable');const backup=await r.json();if(!valid(backup))throw Error('Invalid published backup');return backup}
 return{valid,shouldRestore,load};
})();
