import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
    return (
      <Html>
        <Head />
        <body className='bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }