import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-xl font-bold">色が見つかりませんでした</h1>
      <Link href="/" className="rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background">
        今日の色を見る
      </Link>
    </main>
  );
}
