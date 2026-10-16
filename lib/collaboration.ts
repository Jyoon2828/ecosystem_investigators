export type PersonalWork={found:string[],bins:Record<string,string>,reasons:Record<string,string>,first:Record<string,string>|null,reflection:string,submitted:boolean,name:string};
export type SharedWork={individuals?:Record<string,PersonalWork>,eco:string,found:string[],bins:Record<string,string>,reasons:Record<string,string>,first:Record<string,string>|null,reflection:string,submitted:boolean,chat?:{id:string,author:string,text:string,at:string}[]};
export type Operation={id:string,type:string,item?:string,value?:string,author?:string,actor?:string};
export type Envelope={draft:SharedWork,submission:SharedWork|null,receipts:string[],revision:number};
export const initial=(group:number):Envelope=>({draft:{eco:'',found:[],bins:{},reasons:{},first:null,reflection:'',submitted:false,chat:[]},submission:null,receipts:[],revision:0});
export function apply(d:SharedWork,op:Operation):SharedWork{
 const w=structuredClone(d);w.chat??=[];
 if(op.type.startsWith('personal:')&&op.actor){
  w.individuals??={};const own=w.individuals[op.actor]||{found:[],bins:{},reasons:{},first:null,reflection:'',submitted:false,name:op.author||'모둠원'};
  const result=apply({...own,eco:w.eco},{...op,type:op.type.slice(9)});if(op.type!=='personal:first')result.first=null;
  w.individuals[op.actor]={found:result.found,bins:result.bins,reasons:result.reasons,first:result.first,reflection:result.reflection,submitted:result.submitted,name:op.author||own.name};return w;
 }
 if(op.type==='find'&&op.item&&!w.found.includes(op.item)){w.found.push(op.item);w.submitted=false}
 if(op.type==='classify'&&op.item){w.bins[op.item]=op.value!;w.submitted=false}
 if(op.type==='reason'&&op.item){w.reasons[op.item]=op.value||'';w.submitted=false}
 if(op.type==='reflection'){w.reflection=op.value||'';w.submitted=false}
 if(op.type==='first'&&!w.first)w.first={...w.bins};
 if(op.type==='chat'&&!w.chat.some(m=>m.id===op.id)){w.chat.push({id:op.id,author:op.author||'모둠원',text:op.value||'',at:new Date().toISOString()});w.chat=w.chat.slice(-100)}
 if(op.type==='submit')w.submitted=true;
 return w;
}
export function commit(e:Envelope,ops:Operation[],validIds:string[]):Envelope{
 const next=structuredClone(e);
 for(const op of ops){if(next.receipts.includes(op.id))continue;
  if(op.type.startsWith('personal:')){
   if(!op.actor||!/^[a-zA-Z0-9-]{8,80}$/.test(op.actor)||!['find','classify','reason','first'].includes(op.type.slice(9)))throw new Error('개인 분류 형식을 확인해 주세요.');
   const own=next.draft.individuals?.[op.actor]||{found:[],bins:{},reasons:{},first:null,reflection:'',submitted:false,name:op.author||'모둠원'};
   commit({draft:{...own,eco:next.draft.eco},submission:null,receipts:[],revision:0},[{...op,type:op.type.slice(9)}],validIds);
   if(op.type==='personal:first'&&(own.found.length<6||own.found.some(id=>!['bio','non'].includes(own.bins[id]))))throw new Error('개인 카드를 6개 이상 두 범주로 분류해 주세요.');
   next.draft=apply(next.draft,op);next.receipts.push(op.id);continue;
  }
  if(!next.draft.eco&&op.type!=='chat')throw new Error('선생님이 생태계를 지정할 때까지 기다려 주세요.');
  if(!['find','classify','reason','reflection','first','chat','submit'].includes(op.type))throw new Error('지원하지 않는 작업입니다.');
  if(['find','classify','reason'].includes(op.type)&&!validIds.includes(op.item||''))throw new Error('구성요소를 확인해 주세요.');
  if(op.type==='classify'&&(!['bio','non','unsure'].includes(op.value||'')||!next.draft.found.includes(op.item!)))throw new Error('조사한 요소를 분류해 주세요.');
  if((op.value?.length||0)>(op.type==='reflection'?1000:op.type==='chat'?500:300))throw new Error('입력 내용을 조금 줄여 주세요.');
  if(op.type==='submit'){
   if(next.draft.found.length<6||!next.draft.first||!next.draft.reflection.trim()||next.draft.found.some(id=>!['bio','non'].includes(next.draft.bins[id])))throw new Error('첫 분류와 탐구 정리를 마무리해 주세요.');
  }
  next.draft=apply(next.draft,op);
  if(op.type==='submit')next.submission={...structuredClone(next.draft),chat:[],individuals:{}};
  next.receipts.push(op.id);
 }
 next.receipts=next.receipts.slice(-300);next.revision++;return next;
}
export function decode(p:any,group:number):Envelope{if(p?.draft)return p;if(p?.eco)return {...initial(group),draft:{...p,chat:p.chat||[]},submission:p.submitted?p:null};return initial(group)}
