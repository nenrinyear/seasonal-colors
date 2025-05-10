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
- 色の生成手段について自ら考案、またアルゴリズムの方針を検討
  - 四季に応じた配色
  - 1年を通じて滑らかに変化していく
  - ランダムに値が振れるため毎日見ていても飽きない
- Cloudflareの製品群(Workers, WorkersKV)を活用し、無料・軽量なホスティングを実現

## 利用方法
### 1. Webサイトにアクセス
https://color.nenrin.me/ にアクセス

## 2. セルフホストする

お好みのパッケージマネージャーで、package.jsonに記載の`build`スクリプトを実行する
