(()=>{
const months=[...document.querySelectorAll('.month')];
const entries=months.flatMap((month,monthIndex)=>[...month.querySelectorAll('.entry')].map((entry,index)=>{
  const day=Number(entry.querySelector('.dateNo')?.textContent.trim())||index+1;
  entry.id=`d${monthIndex+1}-${day}`;
  const title=[...entry.querySelectorAll('.saint')].map(node=>node.textContent).join(' ');
  const icons=[...entry.querySelectorAll('.icon-strip figcaption')].map(node=>node.textContent).join(' ');
  return {entry,month,monthIndex,day,search:`${monthIndex+1}월 ${day}일 ${title} ${icons}`.normalize('NFC').toLocaleLowerCase('ko')};
}));
const query=document.getElementById('calendar-search');
const select=document.getElementById('calendar-month');
const status=document.getElementById('calendar-status');
let printMode='year';
function filter(){
 const term=query.value.trim().normalize('NFC').toLocaleLowerCase('ko');
 const selected=Number(select.value);
 let count=0;
 for(const {entry,monthIndex,search} of entries){const visible=(!selected||monthIndex+1===selected)&&(!term||search.includes(term));entry.hidden=!visible;if(visible)count++}
 for(const month of months)month.hidden=![...month.querySelectorAll('.entry')].some(entry=>!entry.hidden);
 status.textContent=term||selected?`${count}일 검색됨${count?' · 날짜를 누르면 상세 내용을 볼 수 있습니다':''}`:'365일 전체 표시';
}
query.addEventListener('input',filter);select.addEventListener('change',filter);
document.getElementById('calendar-reset').addEventListener('click',()=>{query.value='';select.value='';filter();query.focus()});
document.getElementById('calendar-today').addEventListener('click',()=>{
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric'}).formatToParts(new Date()).map(({type,value})=>[type,value]));
 query.value='';select.value='';filter();
 const target=document.getElementById(`d${parts.month}-${parts.day}`);
 if(target){target.scrollIntoView({behavior:'smooth',block:'start'});target.querySelector('summary')?.focus({preventScroll:true})}
});
document.getElementById('calendar-pdf').addEventListener('click',()=>{
 printMode=select.value?'month':'year';
 document.body.classList.toggle('print-month',printMode==='month');
 months.forEach((month,index)=>month.classList.toggle('print-selected',index+1===Number(select.value)));
 entries.forEach(({entry})=>entry.hidden=false);
 months.forEach(month=>month.hidden=false);
 window.print();
});
window.addEventListener('afterprint',()=>{document.body.classList.remove('print-month');months.forEach(month=>month.classList.remove('print-selected'));filter()});
filter();
})();
