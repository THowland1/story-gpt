import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Choose your own AI Adventure!" />
          <meta property="og:site_name" content="storygpt.xyz" />
          <meta
            property="og:description"
            content="Choose your own AI Adventure!"
          />
          <meta property="og:title" content="StoryGPT" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="StoryGPT" />
          <meta
            name="twitter:description"
            content="Choose your own AI Adventure!"
          />
          <meta
            property="og:image"
            content="https://storygpt.xyz/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://storygpt.xyz/og-image.png"
          />
        </Head>
        <body className="bg-indigo-500 text-indigo-50 ">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
