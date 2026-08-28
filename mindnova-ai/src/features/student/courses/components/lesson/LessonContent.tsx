export function LessonContent() {
 return (
 <div className="flex-1 overflow-y-auto bg-white relative">
 <div className="p-8 max-w-4xl mx-auto pb-32">
 {/* Tags */}
 <div className="flex flex-wrap items-center gap-3 mb-6">
 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F0E8] text-[#2C3039]">
 Next.js Mastery
 </span>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] text-[#C0392B] border border-[#E8E2D9]">
 Intermediate
 </span>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEFCF9] text-[#8A8478] border border-[#E8E2D9]">
 25 Phút
 </span>
 </div>

 {/* Title & Description */}
 <h1 className="text-3xl sm:text-4xl font-bold text-[#2C3039] mb-4 tracking-tight font-[family-name:var(--font-playfair-display)]">
 Route Handlers in Next.js
 </h1>
 <p className="text-[#4A4F5C] text-lg mb-8 leading-relaxed">
 Tìm hiểu cách tạo custom request handlers cho các định tuyến thông qua Web Request và Response APIs. Tính năng Route Handlers chỉ khả dụng bên trong thư mục app.
 </p>

 {/* Subheading & Content */}
 <h2 className="text-2xl font-bold text-[#2C3039] mb-4 font-[family-name:var(--font-playfair-display)]">Handling Requests</h2>
 <p className="text-[#4A4F5C] mb-6 leading-relaxed">
 Route Handlers cho phép bạn tạo custom request handlers cho một định tuyến bất kỳ thông qua Web Request và Response APIs. Chúng tương đương với API Routes trong Pages Router, nhưng được khai báo bên trong thư mục app.
 </p>

 {/* Code Block */}
 <div className="bg-[#FEFCF9] rounded-xl overflow-hidden shadow-sm border border-[#E8E2D9]">
 <div className="flex items-center justify-between px-4 py-2.5 bg-[#F5F0E8] border-b border-[#E8E2D9]">
 <span className="text-xs text-[#8A8478] font-mono">app/api/route.ts</span>
 <button type="button" className="text-[#8A8478] hover:text-[#2C3039] transition-colors font-bold text-[10px] uppercase cursor-pointer border border-[#E8E2D9] px-2 py-0.5 rounded bg-white" title="Copy code">
 Copy
 </button>
 </div>
 <div className="p-4 overflow-x-auto">
 <pre className="text-sm font-mono text-[#2C3039]">
 <code>
<span className="text-[#C0392B]">export</span> <span className="text-[#C0392B]">async</span> <span className="text-[#C0392B]">function</span> <span className="text-[#2C3039]">GET</span><span className="text-[#8A8478]">(</span><span className="text-[#2C3039]">request</span><span className="text-[#C0392B]">:</span> <span className="text-[#2C3039]">Request</span><span className="text-[#8A8478]">)</span> <span className="text-[#8A8478]">{`{`}</span>{'\n'}
{' '}<span className="text-[#C0392B]">return</span> <span className="text-[#C0392B]">new</span> <span className="text-[#2C3039]">Response</span><span className="text-[#8A8478]">(</span><span className="text-[#2C3039]">&apos;Hello, Next.js!&apos;</span><span className="text-[#8A8478]">, {`{`}</span>{'\n'}
{' '}<span className="text-[#8A8478]">status:</span> <span className="text-[#2C3039]">200</span><span className="text-[#8A8478]">,</span>{'\n'}
{' '}<span className="text-[#8A8478]">{`}`}</span><span className="text-[#8A8478]">)</span>{'\n'}
<span className="text-[#8A8478]">{`}`}</span>
 </code>
 </pre>
 </div>
 </div>
 </div>
 </div>
 );
}
