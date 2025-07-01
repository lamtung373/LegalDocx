import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi" className="h-full bg-gray-50">
      <Head>
        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="description" content="Hệ thống công chứng - Quản lý hồ sơ công chứng hiệu quả" />
        <meta name="keywords" content="công chứng, bình dương, hệ thống quản lý, hồ sơ" />
        <meta name="author" content="Nguyễn Tùng Lâm" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* OpenGraph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hệ thống Công chứng" />
        <meta property="og:description" content="Hệ thống quản lý hồ sơ công chứng hiệu quả" />
        <meta property="og:site_name" content="Công chứng" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* PWA support */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
