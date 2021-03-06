import React, { useContext, useEffect, useRef, useState } from 'react'
// import blogContext from '../Context/BlogContext';
import {
    Button,
    Card,
    Container,
    Stack,
    TextField,
    Typography,
    Snackbar,
    Chip,
    Autocomplete
} from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import { Editor } from '@tinymce/tinymce-react';
import { SEO } from '../src/compo/SEO';
import { useGlobal } from '../src/context/GlobalItemsProvider';
import { useAuth } from '../src/context/AuthenticationProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import Image from 'next/image';
import LoadingButton from '@mui/lab/LoadingButton';

// uncontrolled input

const CreateBlog = () => {
    // const context = useContext(blogContext);
    const [blogHistory, setBlogHistory] = useState(null)
    let { URL } = useGlobal();
    let { logginUserData } = useAuth()
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [blogError, setBlogError] = useState(null)
    const [blog, setBlog] = useState({
        title: "",
        desc: "",
        tag: [],
        coverImg: null,


    })
    const [tagSuggestions, setTagSuggestions] = useState([])


    const editorRef = useRef(null);



    let history = useRouter()

    useEffect(() => {
        console.log(window.history.state.usr);
        setBlogHistory(window.history.state.usr?.blog);

    }, [])

    const blogUpdate = async () => {
        let res;
        try {
            res = await fetch(`${URL}/api/v1/blog/${blogHistory._id}`, {
                method: 'PATCH',
                body: JSON.stringify(blog),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${logginUserData.authToken}`
                },
            })
        } catch (e) {
            console.log(e.message, typeof e)
            setOpen(true)
            setBlogError({ type: "error", msg: 'Login to post blog...' })
        }
        let status = await res.json()
        if (res.status === 200) {
            setOpen(true)
            setBlogError({ type: "success", msg: "Blog Updated..." })
            // setBlog({
            //     title: "", desc: "",
            //     tag: []
            // })
            // history('/')
        } else {

            setBlogError({ type: "error", msg: status.msg })
            setOpen(true)
        }
    }

    const handleSubmit = async () => {
        if (blogHistory !== undefined) {
            console.log('com', blogHistory);
            return blogUpdate()
        }
        await console.log('before', blog);
        if (blog.desc === '' || blog.tag === []) return
        await setBlog({ ...blog, desc: editorRef.current.getContent() })
        // await setBlog({ ...blog, tag: blog.tag?.split(',') })
        await console.log('after', blog);
        let res;
        try {
            res = await fetch(`${URL}/api/v1/blogs`, {
                method: 'POST',
                body: JSON.stringify(blog),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${logginUserData.authToken}`
                }
            })
        } catch (e) {
            // console.log(e.message, typeof e)
            setOpen(true)
            setBlogError({ type: "error", msg: 'Login to post blog...' })
        }


        let status = await res.json()
        if (res.status === 200) {
            setOpen(true)
            setBlogError({ type: "success", msg: "Blog Published..." })
            setBlog({
                title: "", desc: "",
                tag: []
            })
            history.push('/')
        } else {

            setBlogError({ type: "error", msg: status.msg })
            setOpen(true)
        }

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;


    // make tag suggestion
    const tagSuggestion = async (e, value) => {
        console.log(value);
        console.log(e);
        await fetch(`${URL}/api/v1/tag/s`, {
            method: 'POST',
            body: JSON.stringify({ tag: e.target.value }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${logginUserData.authToken}`
            }
        }).then(res => res.json()).then(data => setTagSuggestions(data))

    }
    const Input = styled('input')({
        display: 'none',
    });
    // Upload image to cloudinary
    const uploadImage = async (e) => {
        let file = e.target.files[0];
        let fd = new FormData()
        setIsLoading(true)
        fd.append('upload_preset', 'yio8fvkd');
        fd.append('file', file);
        console.log(fd.get('file'))
        fetch(`https://api.cloudinary.com/v1_1/dqveulwdc/upload`, {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsLoading(false)

                setBlog({ ...blog, coverImg: data.secure_url })
            }
            )
    }

    return (
        <>
            <SEO
                title='Make New Blog - Dev Blog'
                desc="Dev Blog, where people get perfect words"
                kw="Blog | Dev Blog | ideas | create a blog"
            />
            <Container sx={{ px: 0 }}>
                {/* <Head title='Make New Blog - Dev Blog' /> */}

                <Card sx={{ m: 1, p: 1 }}>
                    <Typography sx={{ m: 1 }}>
                        <Button variant="outlined" onClick={() => history.push('/')} color="inherit"
                            startIcon={<ArrowBackIosNewIcon />}>
                            Go back
                        </Button>
                    </Typography>
                    <Typography textAlign='center' variant='h5' sx={{ my: 2 }} color="text.secondary">{blogHistory?._id ? 'Update' : 'Create'} a
                        blog...</Typography>

                    <Stack gap={3}>


                        {/* input file type for coverImg */}
                        <Stack direction='row' gap={2} alignItems='center'>

                            <Input type="file" id="outlined-button-file" style={{ display: 'none' }} onChange={(e) => {
                                uploadImage(e)
                            }} />
                            <label htmlFor="outlined-button-file">
                                {/* <Button variant="outlined" size='small' color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                    Add or change Cover Image
                                </Button> */}
                                <LoadingButton
                                    // onClick={handleSubmit}
                                    loading={isLoading}
                                    loadingPosition="end"
                                    variant="outlined" size='small' color="primary" component="span"
                                    endIcon={<CloudUploadIcon />}
                                >
                                    Add or change Cover Image
                                </LoadingButton>
                            </label>
                            {blog.coverImg && <Image src={blog.coverImg} alt="coverImg" width={80} height={80} style={{ borderRadius: '5px' }} />}
                        </Stack>


                        <TextField value={blog.title} id="title" label="Title"
                            onChange={e => setBlog({ ...blog, [e.target.name]: e.target.value })} name='title'
                            variant="outlined" />

                        {/* <textarea name="desc" id="descText" cols="30" rows="10"></textarea> */}
                        {


                            <Editor
                                onChange={e => {
                                    console.log(editorRef.current.getContent())
                                    setBlog({ ...blog, desc: editorRef.current.getContent() })
                                }}

                                // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={blog.desc}
                                init={{

                                    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                                    editimage_cors_hosts: ['picsum.photos'],
                                    menubar: 'file edit view insert format tools table help',
                                    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                    toolbar_sticky: false,
                                    toolbar_sticky_offset: isSmallScreen ? 102 : 108,
                                    autosave_ask_before_unload: true,
                                    autosave_interval: '30s',
                                    autosave_prefix: '{path}{query}-{id}-',
                                    autosave_restore_when_empty: false,
                                    autosave_retention: '2m',
                                    image_advtab: true,
                                    link_list: [
                                        { title: 'My page 1', value: 'https://www.tiny.cloud' },
                                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                                    ],
                                    image_list: [
                                        { title: 'My page 1', value: 'https://www.tiny.cloud' },
                                        { title: 'My page 2', value: 'http://www.moxiecode.com' }
                                    ],
                                    image_class_list: [
                                        { title: 'None', value: '' },
                                        { title: 'Some class', value: 'class-name' }
                                    ],
                                    importcss_append: true,
                                    file_picker_callback: (callback, value, meta) => {
                                        /* Provide file and text for the link dialog */
                                        if (meta.filetype === 'file') {
                                            callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                                        }

                                        /* Provide image and alt text for the image dialog */
                                        if (meta.filetype === 'image') {
                                            callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                                        }

                                        /* Provide alternative source and posted for the media dialog */
                                        if (meta.filetype === 'media') {
                                            callback('movie.mp4', {
                                                source2: 'alt.ogg',
                                                poster: 'https://www.google.com/logos/google.jpg'
                                            });
                                        }
                                    },
                                    templates: [
                                        {
                                            title: 'New Table',
                                            description: 'creates a new table',
                                            content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
                                        },
                                        {
                                            title: 'Starting my story',
                                            description: 'A cure for writers block',
                                            content: 'Once upon a time...'
                                        },
                                        {
                                            title: 'New list with dates',
                                            description: 'New List with dates',
                                            content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
                                        }
                                    ],
                                    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                                    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                                    height: 600,
                                    image_caption: true,
                                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                                    noneditable_class: 'mceNonEditable',
                                    toolbar_mode: 'sliding',
                                    contextmenu: 'link image table',
                                    skin: useDarkMode ? 'oxide-dark' : 'oxide',
                                    content_css: useDarkMode ? 'dark' : 'default',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'

                                }}
                            />
                            // <TextField  id="desc" label="Description" onChange={e => setBlog({...blog, [e.target.name]: e.target.value})} name='desc' variant="outlined"  />
                        }
                        <div className="chip" style={{ color: 'red' }}>
                            <Autocomplete
                                aria-required={true}
                                value={blog.tag}
                                multiple
                                id="tags-filled"
                                options={tagSuggestions.map((tag) => tag.name)}
                                defaultValue={[]}
                                freeSolo
                                onChange={(e, value) => setBlog({ ...blog, tag: value })}
                                // onChange={(e, value) => tagSuggestion(e, value)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        // onChange={e => tagSuggestion(e)}
                                        required={true}
                                        {...params}
                                        label="Tags"
                                        placeholder="Add a tag and seprate by enter."
                                    />
                                )}
                            />
                            {/* <ChipInput
                                    name="tags"
                                    variant="outlined"
                                    label="Tags"
                                    fullWidth
                                    color='error'
                                    onChange={e => {
                                        console.log(e)
                                    }}
                                    value={blog.tag}
                                    onAdd={(chip) => handleAddChip(chip)}
                                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                                /> */}
                        </div>
                        {/* <TextField
                                multiline
                                rows={4}
                                id="descText" name='desc' onChange={e => setBlog({ ...blog, [e.target.name]: e.target.value })} label="Enter your descriptions.." variant="outlined" /> */}
                        {/* <TextField id="tag" name='tag' onChange={e => setBlog({ ...blog, tag: e.target.value })} label="Tags" variant="outlined" /> */}
                        <Button variant="text">Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit}>Publish blog</Button>

                    </Stack>
                </Card>
                <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleClose} severity={blogError?.type} sx={{ width: '100%' }}>
                        {blogError?.msg}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    )
}


export default CreateBlog