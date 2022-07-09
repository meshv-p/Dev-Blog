import React from 'react'
import Head from 'next/head'

export const SEO = ({ title = "", desc = "", kw = "" }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={desc} />
                <meta name="keywords" content={kw} />
            </Head>
        </>
    )
}
