import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1>Welcome !</h1>
      <h2> <Link href="/form">Answer this short Survey !</Link></h2>
    </div>
  );
}
