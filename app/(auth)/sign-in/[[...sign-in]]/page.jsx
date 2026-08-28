import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] py-12">
      <SignIn appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-white shadow-xl shadow-slate-200/60 border border-slate-200/80 rounded-2xl",
          headerTitle: "text-slate-900 font-extrabold",
          headerSubtitle: "text-slate-500",
          socialButtonsBlockButton: "border-slate-200 text-slate-600 hover:bg-slate-50",
          formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md transition-all",
          footerActionLink: "text-indigo-600 hover:text-indigo-700"
        }
      }} />
    </div>
  );
}
