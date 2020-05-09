import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
// import theme from '../src/theme';

export default class eCommAdminDocument extends Document {
  render() {
    return (
      <html lang="en">
        <title>eCommAdmin</title>

        <Head>
          {/* Step 5: Output the styles in the head  */}
          {this.props.styles}
          
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}

          {/* manifest */}
          {/* <link rel="manifest" href="/static/manifest.json" /> */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

eCommAdminDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  // Step 1: Create an instance of ServerStyleSheet
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  // Step 2: Retrieve styles from components in the page
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  // Step 3: Extract the styles as <style> tags
  const styleTags = sheets.getStyleElement()

  const initialProps = await Document.getInitialProps(ctx);

  // Step 4: Pass styleTags as a prop
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), styleTags],
  };
};
