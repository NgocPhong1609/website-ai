interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({
  children,
}: Readonly<OnboardingLayoutProps>) {
  return (
    <main className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
      <div className="max-w-7xl min-h-screen w-full flex flex-col items-center mx-auto">
        {children}
      </div>
    </main>
  );
}
