import { MentorSidebar } from "./_components/mentorsidebar";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen">
      <MentorSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
