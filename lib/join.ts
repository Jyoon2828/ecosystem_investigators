export function inviteKey(r:{join?:string,keys:string[]}){return r.join||r.keys[6]||r.keys[0]}
export function validateJoin(body:any){if(!body||typeof body.room!=='string'||!/^[a-f0-9-]{8}$/.test(body.room)||typeof body.join!=='string'||!Number.isInteger(body.group)||body.group<1||body.group>6)throw new Error('학생 입장 링크와 모둠을 확인해 주세요.');return body as {room:string,join:string,group:number}}
