export default function About() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400">About ApniSec</h1>
        
        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
          <p>
            ApniSec is a leading cybersecurity firm dedicated to protecting businesses from the evolving landscape of digital threats. 
            Founded in 2024, we combine human expertise with machine learning to predict and prevent attacks before they happen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
              <h3 className="text-white font-bold text-xl mb-2">Our Mission</h3>
              <p>To provide enterprise-grade security tools that are accessible to everyone.</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
              <h3 className="text-white font-bold text-xl mb-2">Our Vision</h3>
              <p>A safer internet where innovation can thrive without fear of compromise.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}