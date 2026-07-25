import { LoginForm } from "./LoginForm";

// ─── LoginContainer ───────────────────────────────────────────────────────────
// Full-screen layout: centered form

export default function LoginContainer() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#F8F8FC]">
      <div className="w-full lg:w-[500px] xl:w-[540px] flex flex-col min-h-screen bg-white border-x border-[#F0F0F8] shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
