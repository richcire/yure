![hero](github.png)

<p align="center">
    <h1 align="center"><b>유레 揺れ</b></h1>
<p align="center">
    Korean J-POP Fan Community Platform
    <br />
    <br />
    <a href="https://yure.me">Website</a>
    ·
    <a href="https://github.com/richcire/yure/issues">Issues</a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

## About Yure

Yure (揺れ) is a community platform built for Korean J-POP fans. It brings together lyric translations, magazine articles, news, karaoke search, and event schedules — everything a J-POP fan needs, all in one place. Powered by AI for automatic lyric translation from Japanese to Korean.

## Features

**Lyric Translation**: Japanese J-POP lyrics with Korean pronunciation guides and full translations, powered by AI auto-translation.<br/>
**Magazine Articles**: In-depth articles exploring J-POP culture, artists, and trends.<br/>
**News**: Stay up to date with the latest J-POP news and announcements.<br/>
**Karaoke Search**: Look up TJ, KY, and JS karaoke numbers for your favorite J-POP songs.<br/>
**Event Schedule**: Concert and event calendar to never miss a live show.<br/>
**Community**: A space for fans to share and discuss everything J-POP.<br/>
**Threaded Comments**: Engage in discussions with nested, threaded comments on all content.<br/>

## Getting Started

```bash
# Clone the repository
git clone https://github.com/richcire/yure.git
cd yure

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and OpenAI credentials

# Start the development server
pnpm dev
```

## App Architecture

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Supabase
- Tailwind CSS + SCSS
- shadcn/ui (Radix UI)
- Tiptap v3
- OpenAI

### Hosting

- Supabase (Database, Auth, Storage)
- Vercel (Website)
