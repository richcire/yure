import Script from "next/script";

export const AdSenseCodeSnippet = () => {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4738868818137222"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
