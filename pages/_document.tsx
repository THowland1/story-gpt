import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your next quiz in seconds."
          />
          <meta property="og:site_name" content="twitterbio.com" />
          <meta
            property="og:description"
            content="Generate your next quiz in seconds."
          />
          <meta property="og:title" content="quiz Generator" />
          {/* <meta name="twitter:card" content="summary_large_image" /> */}
          <meta name="twitter:title" content="quiz Generator" />
          <meta
            name="twitter:description"
            content="Generate your next quiz in seconds."
          />
          {/* <meta
            property="og:image"
            content="https://twitterbio.com/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://twitterbio.com/og-image.png"
          /> */}
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
