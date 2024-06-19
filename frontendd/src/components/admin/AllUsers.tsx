import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Modal,
    Box,
    TextField,
    CircularProgress,
    MenuItem,
    Select,
    Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllUsers, updateUser, deleteUser } from '../services/apiService';
import { UserEdit } from '../entity/types';

const AllUsers = () => {
    const [users, setUsers] = useState<UserEdit[]>([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string>('USER');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (username.length < 3 && username.length > 20) {
            alert('Username must be between 3 and 20 characters long.');
            return;
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            alert('Invalid email address.');
            return;
        }
        if (password != null) {
            if (password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }
        }
        try {
            await updateUser(editUserId!, username, email, password, role);
            setEditUserId(null);
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
        setIsLoading(false);
    };

    const handleEdit = (user: UserEdit) => {
        setEditUserId(user.id);
        setUsername(user.username);
        setEmail(user.email);
        setRole(user.role);
        setShowModal(true);
    };

    const handleDelete = async (userId: string) => {
        setIsLoading(true);
        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
        setIsLoading(false);
    };

    return (
        <div>
            {isLoading && (
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <CircularProgress />
                </Box>
            )}
            <Grid container spacing={2} justifyContent="center">
                {users.map(user => (
                    <Grid item key={user.id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', position: 'relative' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{user.username}</Typography>
                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            </CardContent>
                            <Box position="absolute" top={8} right={8}>
                                <IconButton color="primary" onClick={() => handleEdit(user)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(user.id)}>
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
                        Edit User
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Select
                            label="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as string)}
                            fullWidth
                            required
                        >
                            <MenuItem value="USER">USER</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
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

export default AllUsers;