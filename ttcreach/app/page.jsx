import Link from 'next/link'
export default function Home() {
  return (
    <div className= "flex justify-center items-center h-screen" >
    <div className='text-center'>
      <h1 className='text-lg'>Welcome !</h1>
     <p>Answer this short Survey <Link className='text-blue-600' href="/form">here !</Link></p>
     <p>Or if you're the editor, change the Survey <Link className='text-amber-600' href="/editor">here !</Link></p>
      </div>
    </div>
  );
}
