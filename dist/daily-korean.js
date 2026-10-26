'use strict';
window.DailyKorean=(()=>{
 const fortunes=[
 '오늘은 꾸준히 해 온 노력이 작은 결실을 맺는 날이에요.',
 '어려웠던 단어가 오늘은 조금 더 친숙하게 느껴질 거예요.',
 '작은 도전 하나가 새로운 자신감으로 이어질 거예요.',
 '잠깐 쉬고 돌아오면 새로운 답이 보일 거예요.',
 '오늘 배운 한 문장이 내일의 대화를 열어 줄 거예요.',
 '서두르지 않고 나아가면 좋은 흐름을 만날 거예요.',
 '익숙한 복습 속에서 뜻밖의 발견을 하게 될 거예요.',
 '오늘은 모르는 것을 물어볼 용기가 행운을 가져다줄 거예요.',
 '짧게라도 집중하는 시간이 기분 좋은 성취로 이어질 거예요.',
 '자신에게 다정하게 말하면 공부도 한결 가벼워질 거예요.',
 '오늘의 작은 성공을 놓치지 말고 기뻐해 주세요.',
 '한 번 더 읽어 본 문장이 오래 기억에 남을 거예요.'
 ];
 // Common Korean proverbs; no invented author attributions.
 const quotes=['천 리 길도 한 걸음부터.','시작이 반이다.','티끌 모아 태산.','배움에는 끝이 없다.','공든 탑이 무너지랴.','구슬이 서 말이라도 꿰어야 보배.','가는 말이 고와야 오는 말이 곱다.','백지장도 맞들면 낫다.','호랑이 굴에 가야 호랑이 새끼를 잡는다.','돌다리도 두들겨 보고 건너라.','고생 끝에 낙이 온다.','하늘은 스스로 돕는 자를 돕는다.'];
 function forDay(day){const n=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);return{fortune:fortunes[((n%fortunes.length)+fortunes.length)%fortunes.length],quote:quotes[(((n*7+3)%quotes.length)+quotes.length)%quotes.length]}}
 function render(day){const box=document.querySelector('#dailyKorean');if(!box)return;const lines=forDay(day);box.innerHTML=`<p lang="ko"><span>오늘의 운세</span> ${lines.fortune}</p><p lang="ko"><span>오늘의 한마디</span> “${lines.quote}”</p>`}
 return{forDay,render};
})();
