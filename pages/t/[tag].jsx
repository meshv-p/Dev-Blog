import React, { useContext, useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import blogContext from '../Context/BlogContext'
// import { Blog } from './Blog'
import { Card, CardContent, CardHeader, Container, CssBaseline, Skeleton, Typography } from '@mui/material';
// import { Head } from './Head';
import { stringToColor } from '../../src/utils/commonFunctioins';
import { Blog } from '../../src/compo/Blogs';
import { useRouter } from 'next/router';
import { SEO } from '../../src/compo/SEO';

const TagWiseBlog = ({ tags: { result: tags } }) => {
    // const [searchData, setSearchData] = useState(tags)
    let router = useRouter()
    let { tag } = router.query
    // const context = useContext(blogContext);
    // let { url } = context;


    useEffect(() => {
        console.log(tags)

        // fetch(`${url}/api/v1/search?tag=${tag}`).then(res => res.json()).then(data => {

        //     setSearchData(data.result);


        // });
    }, [])


    return (
        <>
            <SEO
                title={`#${tag} - Dev Blog`}
                desc="Dev Blog, where people get perfect words"
                kw={`#${tag} |  Blog | Dev Blog | ideas | content`}
            />
            <Container maxWidth='lg' sx={{ p: 1 }}>
                {/* <Head title={`#${tag} - Dev Blog`} /> */}
                <Card sx={{ minWidth: 275 }}>

                    <CardContent sx={{ borderTop: `1rem solid ${stringToColor(tag)}` }}>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Tag
                        </Typography>
                        <Typography variant="h5" component="div" color={stringToColor(tag)}>
                            #  {tag}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Official tag for Facebooks React JavaScript library for building user interfaces

                        </Typography>
                    </CardContent>
                </Card>
            </Container>

            <Container sx={{ pt: 2 }}>
                <CssBaseline />
                {
                    !tags && (
                        <Card sx={{ m: 2 }}>
                            <CardHeader
                                avatar={

                                    <Skeleton animation="wave" variant="circular" width={40} height={40} />

                                }

                                title={

                                    <Skeleton
                                        animation="wave"
                                        height={10}
                                        width="80%"
                                        style={{ marginBottom: 6 }}
                                    />

                                }
                                subheader={

                                    <Skeleton animation="wave" height={10} width="40%" />

                                }
                            />

                            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />


                            <CardContent>

                                <React.Fragment>
                                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={10} width="80%" />
                                </React.Fragment>

                            </CardContent>
                        </Card>
                    )
                }
                {
                    tags &&
                    tags?.map(blog => (
                        <Blog blog={blog} key={blog._id} />
                    ))
                }
            </Container>

        </ >
    )
}

export default TagWiseBlog

export async function getServerSideProps(context) {
    let { tag } = context.query
    // console.log(context);
    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )
    // export async function getStaticProps() {
    const res1 = await fetch(
        `https://mernblog.azurewebsites.net/api/v1/search?tag=${tag}`
    );

    const tags = await res1.json();

    // Pass data to the page via props
    return { props: { tags } };
}