export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-xl font-bold">色が見つかりませんでした</h1>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Leave the 404 with a full page navigation. */}
      <a href="/" className="rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background">
        今日の色を見る
      </a>
    </main>
  );
}
