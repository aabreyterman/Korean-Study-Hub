'use strict';
window.StudyLanguage=(()=>{
 const KEY='anastasiia-study-language',dictionary=window.KoreanUIStrings||{},textSources=new WeakMap(),attributeSources=new WeakMap();let language='en',observer=null,queued=false;
 try{language=localStorage.getItem(KEY)==='ko'?'ko':'en'}catch{}
 const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];
 // Study content keeps the English/Russian meanings and the learner's own wording.
 const protectedContent='script,style,textarea,input,[translate="no"],[data-user-content],.language-toggle,.korean,.answer,.forms,.choice,.study-note,.memory-hint p,.typed-source,#sourcePreview,.hanja-vocab,.hanja-entry summary span,.book-note-row>strong,.book-note-row>span,.book-note-row>small,.typing-card>h3,#typingFeedback p,.saved-word>strong,.saved-meaning,.relation-terms strong,.relation-terms p,.relation-note,.meaning,.mistake-row,.feedback p';
 function translate(value,target=language){if(target!=='ko'||typeof value!=='string')return value;const text=value.trim();if(!text)return value;const pad=result=>value.slice(0,value.indexOf(text))+result+value.slice(value.indexOf(text)+text.length);if(Object.hasOwn(dictionary,text))return pad(dictionary[text]);let result=text;
 const date=result.match(/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/);if(date&&months.includes(date[2]))return pad(`${date[3]}년 ${months.indexOf(date[2])+1}월 ${+date[1]}일`);
 const month=result.match(/^([A-Z][a-z]+) (\d{4})$/);if(month&&longMonths.includes(month[1]))return pad(`${month[2]}년 ${longMonths.indexOf(month[1])+1}월`);
 const suffix=result.match(/^(.+?)( [↗→←✓])$/u);if(suffix){const base=translate(suffix[1],'ko');if(base!==suffix[1])return pad(base+suffix[2])}
 const numbered=result.match(/^(\d+)\. (.+)$/);if(numbered&&dictionary[numbered[2]])return pad(numbered[1]+'. '+dictionary[numbered[2]]);
 const prefix=result.match(/^([⌂◔字▤가▦☷♡✎✿≈↔★✓○→↺＋]+\s+)(.+)$/u);if(prefix){const rest=translate(prefix[2],'ko');if(rest!==prefix[2])return pad(prefix[1]+rest)}
 const patterns=[
 [/^(\d+)(?:st|nd|rd|th) TOPIK I \/ II (PBT|IBT)$/,(_,n,type)=>'제'+n+'회 TOPIK I / II '+type],
 [/^Registration (.+)$/,(_,dates)=>'접수 '+translate(dates,'ko')],
 [/^Saved in Chrome \+ (.+)$/,(_,file)=>'Chrome + '+file+' 저장됨'],
 [/^Listen to (.+)$/,(_,word)=>word+' 발음 듣기'],
 [/^Mark learned (.+)$/,(_,word)=>word+' 익힘 표시'],
 [/^Mark still learning (.+)$/,(_,word)=>word+' 학습 중 표시'],
 [/^TOPIK (\d+) (PBT|IBT)$/,(_,n,type)=>'제'+n+'회 TOPIK '+type],
 [/^Checked (\d{4}-\d{2}-\d{2})\. These are dated official notices, not a live registration feed\.$/,(_,date)=>date+' 확인. 공지된 공식 일정이며 실시간 접수 현황은 아니에요.'],
 [/^Complete (Revise 20 words|Yesterday’s words|Hanja|Student book|Add new vocabulary)$/,(_,task)=>translate(task,'ko')+' 완료'],
 [/^(.*): (\d+)% completed\. (.*)\. Open chapter progress\.$/,(_,title,n,detail)=>translate(title,'ko')+': '+n+'% 완료. '+translate(detail,'ko')+'. 단원별 진도 열기.'],
 [/^(\d+)% completed$/,(_,n)=>n+'% 완료'],
 [/^Results (.+)$/,(_,date)=>'성적 발표 '+translate(date,'ko')],
 [/^(\d{4}-\d{2}-\d{2}), studied (\d+) minutes(.*)$/,(_,day,n,rest)=>day+', '+n+'분 공부'+(rest?', 계획 있음':'')],
 [/^(\d+) \/ (\d+) completed$/,(_,a,b)=>`${b}개 중 ${a}개 완료`],
 [/^(\d+) steps done\. Keep going at your own pace\.$/,(_,n)=>`${n}개를 마쳤어요. 내 속도에 맞춰 계속해요.`],
 [/^(\d+) day streak$/,(_,n)=>`${n}일 연속 공부`],[/^day streak$/,'일 연속 공부'],[/^\/ (\d+) vocabulary learned$/,(_,n)=>`/ ${n}개 단어 익힘`],
 [/^(\d+) \/ (\d+) chapters$/,(_,a,b)=>`${b}개 단원 중 ${a}개 완료`],[/^\/ (\d+) chapters$/,(_,n)=>`/ ${n}개 단원`],
 [/^(\d+) \/ (\d+) parts covered$/,(_,a,b)=>`${b}개 부분 중 ${a}개 완료`],[/^(\d+) \/ (\d+) parts$/,(_,a,b)=>`${b}개 부분 중 ${a}개 완료`],
 [/^(\d+) parts$/,(_,n)=>`${n}개 부분`],[/^(\d+) cards$/,(_,n)=>`카드 ${n}개`],[/^(\d+) words$/,(_,n)=>`단어 ${n}개`],[/^(\d+) questions$/,(_,n)=>`${n}문제`],[/^(\d+) groups$/,(_,n)=>`${n}개 묶음`],
 [/^(\d+) min saved$/,(_,n)=>`${n}분 저장됨`],[/^(\d+) min$/,(_,n)=>`${n}분`],[/^(\d+) minutes$/,(_,n)=>`${n}분`],
 [/^(Chapter|CHAPTER) (\d+)$/,(_,a,n)=>`${n}단원`],[/^Ch\. ([\d, +]+)$/,(_,n)=>`${n}단원`],[/^Lesson (\d+)$/,(_,n)=>`학습 ${n}`],
 [/^Grammar (\d+) lesson$/,(_,n)=>`문법 ${n} 학습`],[/^(Grammar|Quiz Yourself|Quiz|Conversation|Vocabulary) (\d+)$/,(_,part,n)=>`${({Grammar:'문법','Quiz Yourself':'확인 퀴즈',Quiz:'퀴즈',Conversation:'대화',Vocabulary:'어휘'})[part]} ${n}`],
 [/^Whole chapter · all parts$/,'전체 단원 · 모든 부분'],[/^Other chapter words$/,'그 밖의 단원 어휘'],
 [/^Study vocabulary \((\d+)\)$/,(_,n)=>`어휘 학습 (${n})`],[/^Study grammar \((\d+)\)$/,(_,n)=>`문법 학습 (${n})`],[/^Test chapter words \((\d+)\)$/,(_,n)=>`단원 어휘 퀴즈 (${n})`],
 [/^Deleted words \((\d+)\)$/,(_,n)=>`삭제한 단어 (${n})`],[/^Learn all (\d+) words →$/,(_,n)=>`단어 ${n}개 학습 →`],[/^Learn (\d+) words →$/,(_,n)=>`단어 ${n}개 학습 →`],
 [/^Next: (.+)$/,(_,next)=>'다음: '+translate(next,'ko')],[/^Covered today: (.+)$/,(_,parts)=>'오늘 학습: '+translate(parts,'ko')],
 [/^Saved to Chapter (\d+) · (.+)$/,(_,n,date)=>`${n}단원에 저장됨 · ${date}`],
 [/^(\d+) \/ (\d+) recalled ♡$/,(_,a,b)=>`${b}개 중 ${a}개 기억했어요 ♡`],[/^(\d+)\/(\d+) recalled ♡$/,(_,a,b)=>`${b}개 중 ${a}개 기억했어요 ♡`],
 [/^All (\d+) · full stack$/,(_,n)=>`전체 ${n}개`],[/^All (\d+) groups$/,(_,n)=>`전체 ${n}개 묶음`],
 [/^CARD (\d+) \/ (\d+)$/,(_,a,b)=>`카드 ${a} / ${b}`],[/^QUESTION (\d+) \/ (\d+)$/,(_,a,b)=>`문제 ${a} / ${b}`],[/^(\d+) CORRECT$/,(_,n)=>`정답 ${n}개`],[/^PAGE (\d+) \/ (\d+)$/,(_,a,b)=>`페이지 ${a} / ${b}`],
 [/^You reached the end of (\d+) cards\.$/,(_,n)=>`카드 ${n}개 학습을 마쳤어요.`],[/^You reviewed (\d+) distinct cards in this pass\.$/,(_,n)=>`이번에 서로 다른 카드 ${n}개를 복습했어요.`],
 [/^(\d+) words to revisit\. You’re closer than when you started\.$/,(_,n)=>`단어 ${n}개를 다시 복습해요. 시작할 때보다 한 걸음 나아갔어요.`],
 [/^TOPIK Level (\d+)$/,(_,n)=>`TOPIK ${n}급`],[/^Three recent timed PBT mocks at (\d+)\+\/300$/,(_,n)=>`최근 시간제한 PBT 모의고사 3회에서 ${n}점 이상 / 300점`],
 [/^Level (\d+) checkpoint:$/,(_,n)=>`${n}급 중간 목표일:`],
 [/^Suggested (\d+)-minute routine$/,(_,n)=>`${n}분 추천 학습`],
 [/^(\d+)-day current streak · best (\d+) · (\d+) study days\. Dates use Dubai time\. Select a date to plan or log study\.$/,(_,a,b,c)=>`${a}일 연속 공부 · 최장 ${b}일 · 총 ${c}일 공부. 두바이 시간 기준이에요. 날짜를 눌러 계획이나 기록을 남기세요.`],
 [/^(\d+) matching cards · (\d+) original notebook rows preserved; Hanja entries cite book pages$/,(_,a,b)=>`카드 ${a}개 · 필기 원본 ${b}개 보존 · 한자는 교재 쪽수 표시`],
 [/^SEEN (\d+) TIMES · ✓ KNOWN (\d+) · ↺ AGAIN (\d+)(?: · FORGOT (\d+)×)?$/,(_,a,b,c,d)=>`본 횟수 ${a}회 · ✓ 알아요 ${b}회 · ↺ 다시 ${c}회${d?' · 잊음 '+d+'회':''}`]
 ];
 for(const [pattern,replacement]of patterns)if(pattern.test(result))return pad(result.replace(pattern,replacement));
 if(result.includes(' · '))result=result.split(' · ').map(part=>translate(part,'ko')).join(' · ');
 if(result.includes(' + '))result=result.split(' + ').map(part=>translate(part,'ko')).join(' + ');
 // Dynamic headings, part choices, and status text keep numeric values unchanged.
 result=result.replace(/\b(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})\b/g,(_,day,month,year)=>`${year}년 ${months.indexOf(month)+1}월 ${+day}일`);
 result=result.replace(/\b(Chapter|CHAPTER|Ch\.) (\d+)\b/g,(_,a,n)=>`${n}단원`).replace(/\b(Grammar|Quiz Yourself|Quiz|Conversation|Vocabulary) (\d+)\b/g,(_,a,n)=>`${({Grammar:'문법','Quiz Yourself':'확인 퀴즈',Quiz:'퀴즈',Conversation:'대화',Vocabulary:'어휘'})[a]} ${n}`).replace(/(\d+\/\d+) complete\b/g,'$1 완료');
 return pad(result);
 }
 function protectedNode(element){return !element||!!element.closest(protectedContent)}
 function remembered(sourceMap,key,current){let entry=sourceMap.get(key);if(!entry||current!==entry.last)entry={original:current,last:current};return entry}
 function apply(){if(typeof document==='undefined'||!document.body)return;observer?.disconnect();document.documentElement.lang=language;document.title=language==='ko'?'Anastasiia 한국어 공부':'Anastasiia korean studies';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){if(protectedNode(node.parentElement)||node.parentElement.matches('.feedback'))continue;const item=remembered(textSources,node,node.nodeValue);let output=language==='ko'?translate(item.original,'ko'):item.original;
 if(language==='ko'&&node.parentElement.matches('.mini-weekday,.weekday')){const siblings=[...node.parentElement.parentElement.children].filter(el=>el.matches('.mini-weekday,.weekday'));output=['월','화','수','목','금','토','일'][siblings.indexOf(node.parentElement)]||output}
 if(node.nodeValue!==output)node.nodeValue=output;item.last=output;textSources.set(node,item)}
 for(const element of document.body.querySelectorAll('[aria-label],[placeholder],[title],optgroup[label]')){if(element.closest('[translate="no"],[data-user-content],.language-toggle'))continue;let records=attributeSources.get(element);if(!records){records=new Map();attributeSources.set(element,records)}for(const name of ['aria-label','placeholder','title','label']){if(!element.hasAttribute(name))continue;const current=element.getAttribute(name),item=remembered(records,name,current),output=language==='ko'?translate(item.original,'ko'):item.original;if(current!==output)element.setAttribute(name,output);item.last=output;records.set(name,item)}}
 for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
 observer?.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','label']});
 }
 function set(next){language=next==='ko'?'ko':'en';try{localStorage.setItem(KEY,language)}catch{}apply()}
 function start(){if(typeof document==='undefined')return;document.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>set(button.dataset.language));if(typeof MutationObserver!=='undefined')observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply()})});apply()}
 return{translate,set,start,apply,get:()=>language,protectedNode};
})();
window.StudyLanguage.start();
