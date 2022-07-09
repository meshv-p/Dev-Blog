import React, { useEffect } from "react";
import { Blog } from "../src/compo/Blogs";
import { useGlobal } from "../src/context/GlobalItemsProvider";
import styles from "../styles/Home.module.css";
import { Container } from "@mui/material";
import { useAuth } from "../src/context/AuthenticationProvider";
import { useRouter } from "next/router";
import { SEO } from "../src/compo/SEO";

export default function Home({ data: { allBlogs } }) {
  let { theme } = useGlobal();
  let { setLogginUserData, logginUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setLogginUserData(JSON.parse(localStorage.getItem("user"))?.profile);
  }, []);

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch(
      `/user/${JSON.parse(localStorage.getItem("user"))?.profile?._id}`
    );
  }, []);
  return (
    <>
      <SEO
        title="Dev Blog"
        desc="Dev Blog, where people get perfect words"
        kw="Blog | Dev Blog | ideas | content"
      />

      <Container sx={{ pt: 2 }}>
        <React.Suspense fallback="Loading...">
          {/* make dynamic */}

          {allBlogs &&
            allBlogs?.map((blog, index) => (
              <Blog blog={blog} key={index} index={index} theme={theme} />
            ))}
        </React.Suspense>
        <footer className={styles.footer}>
          All Rights reserved by Dev Blog
        </footer>
      </Container>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  // export async function getStaticProps() {
  const resOfBlog = await fetch(
    `https://mernblog.azurewebsites.net/api/v1/blogs/?page=1`
  );

  const data = await resOfBlog.json();

  // Pass data to the page via props
  return { props: { data } };
}
