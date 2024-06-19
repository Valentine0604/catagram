import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Modal,
    Box,
    TextField,
    CircularProgress,
    Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getPosts, updatePost, deletePost } from '../services/apiService';
import { Post } from '../entity/types';

const AllUserPosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [editPostId, setEditPostId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await getPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updatePost(editPostId!, title, body, image);
            setEditPostId(null);
            setTitle('');
            setBody('');
            setImage(null);
            setShowModal(false);
            fetchPosts();
        } catch (error) {
            console.error('Failed to update post:', error);
        }
        setIsLoading(false);
    };

    const handleEdit = (post: Post) => {
        setEditPostId(post.id);
        setTitle(post.title);
        setBody(post.body);
        setShowModal(true);
    };

    const handleDelete = async (postId: string) => {
        setIsLoading(true);
        try {
            await deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
        setIsLoading(false);
    };

    const renderImage = (post: Post) => {
        if (post.image && post.image.data) {
            return <CardMedia component="img" height="200" image={`data:image/jpeg;base64,${post.image.data}`} alt="Post Image" />;
        }
        return null;
    };

    return (
        <div>
            {isLoading && (
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <CircularProgress />
                </Box>
            )}
            <Grid container spacing={2} justifyContent="center">
                {posts.map(post => (
                    <Grid item key={post.id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {renderImage(post)}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>{post.title}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">by {post.author}</Typography>
                                <Typography variant="body1" paragraph>{post.body}</Typography>
                            </CardContent>
                            <Box position="absolute" top={8} right={8}>
                                <IconButton color="primary" onClick={() => handleEdit(post)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(post.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: { xs: '90%', sm: 400 },
                }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Edit Post
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            label="Body"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                        />
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                        />
                        <Box display="flex" justifyContent="flex-end" marginTop={2}>
                            <IconButton color="primary" onClick={() => setShowModal(false)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton color="primary" type="submit">
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AllUserPosts;