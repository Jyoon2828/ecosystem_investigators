import {database,fail} from '../../../lib/server';import {inviteKey,validateJoin} from '../../../lib/join';
export const runtime='nodejs';
export async function POST(req:Request){try{const b=validateJoin(await req.json());const r=(await database().collection('ecoRooms').doc(b.room).get()).data();if(!r||inviteKey(r as any)!==b.join)return Response.json({error:'학생 입장 링크가 맞지 않습니다. 선생님께 링크를 다시 받아 주세요.'},{status:403});return Response.json({key:r.keys[b.group-1]},{headers:{'Cache-Control':'no-store'}})}catch(e){return fail(e)}}
