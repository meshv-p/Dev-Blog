import { Container, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Blog } from '../src/compo/Blogs';
import { useGlobal } from '../src/context/GlobalItemsProvider';
// import blogContext from '../Context/BlogContext';
// import { Blog } from '../Compo/Blog';
// import { Head } from '../Compo/Head';

const SearchPage = () => {
    // const context = useContext(blogContext);
    let { searchData, alignment, setAlignment, search } = useGlobal();



    const handleChange = (event, newAlignment) => {
        if (!newAlignment) return
        setAlignment(newAlignment);
    };




    return (
        <>
            <Container sx={{ m: 2 }}>
                {/* <Head title={`${search} • Dev Blog`} /> */}

                <Stack direction='row' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>

                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        orientation='vertical'
                        exclusive
                        onChange={handleChange}
                        sx={{ p: 2 }}
                    >
                        <ToggleButton value="title">Blog</ToggleButton>
                        <ToggleButton value="tag">Tag</ToggleButton>
                        <ToggleButton value="user">User</ToggleButton>
                    </ToggleButtonGroup>
                    {/* <div className="results"> */}
                    <Paper sx={{ flexGrow: 1, p: 1 }}>
                        <Typography variant='subtitle1'>Your Search Results: <b>  {search}</b></Typography>
                        {
                            searchData?.message === 'Not found' ?
                                <h1 style={{ padding: 1 }}>
                                    Result Not found
                                </h1> :


                                alignment && searchData && searchData?.map((data, index) => (
                                    <Blog blog={data} key={data._id} BlogType={alignment} />
                                ))
                        }
                    </Paper>
                    {/* </div> */}
                </Stack>

            </Container>
        </>
    )
}


export default SearchPage