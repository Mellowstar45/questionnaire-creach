import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1 className='w-full px-10'>Welcome !</h1>
      <h2> <Link href="/form">Answer this short Survey here !</Link></h2>
    </div>
  );
}
