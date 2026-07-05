export function LessonContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      <div className="p-8 max-w-4xl mx-auto pb-32">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5]">
            Next.js Mastery
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFEFF] text-[#0891B2]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Intermediate
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            25m
          </span>
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Route Handlers in Next.js
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Learn how to create custom request handlers for a given route using the Web Request and Response APIs. Route Handlers are available only inside the app directory.
        </p>

        {/* Video Player Placeholder */}
        <div className="relative w-full aspect-video bg-[#0f172a] rounded-2xl overflow-hidden mb-12 shadow-lg group cursor-pointer">
          {/* Abstract background representing code environment */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80"></div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
              <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>

        {/* Subheading & Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Handling Requests</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs. They are the equivalent of API Routes in the Pages Router, but they are defined inside the app directory.
        </p>

        {/* Code Block */}
        <div className="bg-[#0D1117] rounded-xl overflow-hidden shadow-sm border border-gray-800">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono">app/api/route.ts</span>
            <button className="text-gray-400 hover:text-white transition-colors" title="Copy code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-300">
              <code>
<span className="text-[#FF7B72]">export</span> <span className="text-[#FF7B72]">async</span> <span className="text-[#FF7B72]">function</span> <span className="text-[#D2A8FF]">GET</span><span className="text-gray-300">(</span><span className="text-[#FFA657]">request</span><span className="text-[#FF7B72]">:</span> <span className="text-[#79C0FF]">Request</span><span className="text-gray-300">)</span> <span className="text-gray-300">{`{`}</span>{'\n'}
{'  '}<span className="text-[#FF7B72]">return</span> <span className="text-[#FF7B72]">new</span> <span className="text-[#79C0FF]">Response</span><span className="text-gray-300">(</span><span className="text-[#A5D6FF]">'Hello, Next.js!'</span><span className="text-gray-300">, {`{`}</span>{'\n'}
{'    '}<span className="text-gray-300">status:</span> <span className="text-[#79C0FF]">200</span><span className="text-gray-300">,</span>{'\n'}
{'  '}<span className="text-gray-300">{`}`}</span><span className="text-gray-300">)</span>{'\n'}
<span className="text-gray-300">{`}`}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
