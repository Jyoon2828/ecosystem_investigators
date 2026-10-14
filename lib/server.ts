import {cert,getApps,initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
export function database(){if(!getApps().length){const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;if(!raw)throw new Error('Firebase 서버 설정이 필요합니다. README를 확인해 주세요.');initializeApp({credential:cert(JSON.parse(raw))});}return getFirestore();}
export function fail(e:unknown){return Response.json({error:e instanceof Error?e.message:'연결을 확인해 주세요.'},{status:500});}
