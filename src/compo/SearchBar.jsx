import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { useGlobal } from '../context/GlobalItemsProvider';
// import { useNavigate } from 'react-router-dom';
// import SearchIcon from '@mui/icons-material/Search';

// import blogContext from '../Context/BlogContext';

export const SearchBar = () => {
    // const context = useContext(blogContext);
    let { setSearchData, alignment, search, setSearch, URL } = useGlobal();

    function SearchData(searchValue) {
        fetch(`${URL}/api/v1/search?${alignment}=${searchValue}`).then(res => res.json()).then(data => {
            if (data.message) {
                // console.log('not usr');
                return setSearchData({ message: "Not found" });
            } else {

                setSearchData(data.result);

            }
        });
    }

    // const loading = open && options.length === 0;
    let history = useRouter()

    function handleSearch(e, s) {
        let searchValue = s || e?.target?.value;
        setSearch(searchValue)
        // console.log(searchValue);
        // input.current.autofocus = true
        if (searchValue === '') {
            // console.log('setting null')
            setSearchData([])
        }
        // console.log(searchValue)
        SearchData(searchValue);
    }


    useEffect(() => {
        if (search === '') return
        SearchData(search)
    }, [alignment, history])


    return (
        <div>


            <form
                style={{ marginLeft: '10px' }}
                onSubmit={e => {
                    e.preventDefault()
                    history.push('/search')
                }}
            >

                <TextField
                    variant='filled'
                    value={search}
                    // id="outlined-name"
                    label="Search"
                    onChange={handleSearch}
                    placeholder="Search blog by name,tag"
                />

            </form>
        </div>
    )


}

