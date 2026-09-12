export function LessonContent() {
 return (
 <div className="flex-1 overflow-y-auto bg-white relative">
 <div className="p-8 max-w-4xl mx-auto pb-32">
 {/* Tags */}
 <div className="flex flex-wrap items-center gap-3 mb-6">
 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#0F172A]">
 Next.js Mastery
 </span>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#3B82F6] border border-[#E2E8F0]">
 Intermediate
 </span>
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
 25 Phút
 </span>
 </div>

 {/* Title & Description */}
 <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4 tracking-tight font-serif">
 Route Handlers in Next.js
 </h1>
 <p className="text-[#64748B] text-lg mb-8 leading-relaxed">
 Tìm hiểu cách tạo custom request handlers cho các định tuyến thông qua Web Request và Response APIs. Tính năng Route Handlers chỉ khả dụng bên trong thư mục app.
 </p>

 {/* Subheading & Content */}
 <h2 className="text-2xl font-bold text-[#0F172A] mb-4 font-serif">Handling Requests</h2>
 <p className="text-[#64748B] mb-6 leading-relaxed">
 Route Handlers cho phép bạn tạo custom request handlers cho một định tuyến bất kỳ thông qua Web Request và Response APIs. Chúng tương đương với API Routes trong Pages Router, nhưng được khai báo bên trong thư mục app.
 </p>

 {/* Code Block */}
 <div className="bg-[#F8FAFC] rounded-xl overflow-hidden shadow-sm border border-[#E2E8F0]">
 <div className="flex items-center justify-between px-4 py-2.5 bg-[#F1F5F9] border-b border-[#E2E8F0]">
 <span className="text-xs text-[#64748B] font-mono">app/api/route.ts</span>
 <button type="button" className="text-[#64748B] hover:text-[#0F172A] transition-colors font-bold text-[10px] uppercase cursor-pointer border border-[#E2E8F0] px-2 py-0.5 rounded bg-white" title="Copy code">
 Copy
 </button>
 </div>
 <div className="p-4 overflow-x-auto">
 <pre className="text-sm font-mono text-[#0F172A]">
 <code>
<span className="text-[#3B82F6]">export</span> <span className="text-[#3B82F6]">async</span> <span className="text-[#3B82F6]">function</span> <span className="text-[#0F172A]">GET</span><span className="text-[#64748B]">(</span><span className="text-[#0F172A]">request</span><span className="text-[#3B82F6]">:</span> <span className="text-[#0F172A]">Request</span><span className="text-[#64748B]">)</span> <span className="text-[#64748B]">{`{`}</span>{'\n'}
{' '}<span className="text-[#3B82F6]">return</span> <span className="text-[#3B82F6]">new</span> <span className="text-[#0F172A]">Response</span><span className="text-[#64748B]">(</span><span className="text-[#0F172A]">&apos;Hello, Next.js!&apos;</span><span className="text-[#64748B]">, {`{`}</span>{'\n'}
{' '}<span className="text-[#64748B]">status:</span> <span className="text-[#0F172A]">200</span><span className="text-[#64748B]">,</span>{'\n'}
{' '}<span className="text-[#64748B]">{`}`}</span><span className="text-[#64748B]">)</span>{'\n'}
<span className="text-[#64748B]">{`}`}</span>
 </code>
 </pre>
 </div>
 </div>
 </div>
 </div>
 );
}
