import React from 'react'
import Head from 'next/head'
import Script from 'next/script'

export const SEO = ({ title = "", desc = "", kw = "" }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={desc} />
                <meta name="keywords" content={kw} />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css" />
                <script defer src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
            </Head>
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HR2GSMJNE9"></Script>
                <Script id="google-analytics" strategy="afterInteractive">
                   {` window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments)}
                    gtag('js', new Date());

                    gtag('config', 'G-HR2GSMJNE9');`}
                </Script>
        </>
    )
}
