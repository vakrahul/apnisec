import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-5xl font-bold mb-6 text-cyan-400">
        Welcome to ApniSec
      </h1>
      <p className="text-xl mb-8 text-gray-300">
        Secure your infrastructure with our advanced tools.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/dashboard" 
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-lg transition"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/login" 
          className="border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold py-3 px-6 rounded-lg transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}