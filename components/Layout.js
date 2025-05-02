import Head from 'next/head';
import NavBar from './NavBar';

export default function Layout({ children, title = 'Birdie Blog' }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A simple blog platform built with Next.js and Prisma" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    
    </div>
  );
}