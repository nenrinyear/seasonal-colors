# SeasonalColors

## 各種リンク
### ソースコード

https://github.com/nenrinyear/seasonal-colors

### デモ
https://color.nenrin.me/

## 使用言語
- Node.js

## 利用ライブラリ等
- `@opennextjs/cloudflare`
- `TypeScript`
- `Next.js 15 App Router`
- `Tailwind CSS`
- `seedrandom`
- `eslint`
- `wrangler`

## 動作概要
![image](https://github.com/user-attachments/assets/0477be25-b88e-4bdf-89fd-5086fc3d76f1)
https://color.nenrin.me/ にアクセスした様子

![image](https://github.com/user-attachments/assets/98653053-a272-4f97-8d98-0a00a4fa05d2)
翌日にアクセスした様子(WorkersKV, seedramdom,を利用し乱数を永続化)

## 頑張った点
- 色の生成手段について自ら考案
- アルゴリズムの方針を検討
- Cloudflareの製品群(Workers, WorkersKV)を活用し、無料・軽量なホスティングを実現

## 利用方法
### 1. Webサイトにアクセス
https://color.nenrin.me/ にアクセス

## 2. セルフホストする

お好みのパッケージマネージャーで、package.jsonに記載の`build`スクリプトを実行する


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
