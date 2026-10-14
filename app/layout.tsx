import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={title:'생태계 조사대 | 찾고, 나누고, 다시 생각하기',description:'초등 4학년 생태계 구성요소 조사·분류·비교 탐구'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
