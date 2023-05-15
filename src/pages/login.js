import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import './login.css';

const Login = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const customId1 = "customId1";
    const customId2 = "customId2";

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        // post username and password
        axios.post(`${API_URL}/api/auth/login`, {
            username: username,
            password: password
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem('userData', JSON.stringify({ token: response.data.Token, userId: response.data.userId, name: response.data.Name, username: response.data.username }));
                toast.success('Login Successful!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 800,
                    toastId: customId1
                });
                window.location = '/';
                setLoading(false);
            } else {
                toast.error(response.data.Error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 800,
                    toastId: customId2
                });
                setLoading(false);
            }
        }).catch(error => {
            // handle error
            toast.error(error.response.data.Error || "Failed to login!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 800,
                toastId: customId2
            });
            console.log(error.response.data.Error);
            setLoading(false);
        });
    };

    if (localStorage.getItem('userData')) {
        window.location = '/';
    };

    return (
        <div className='cardBody'>
            <ToastContainer />
            <div className="card mb-3 mx-auto rounded-3" style={{ maxWidth: "740px" }}>
                <div className="row g-0">
                    <div className="col-md-5 login-image text-center rounded-start" style={{ backgroundColor: "#5dabfc" }}>
                        <p className="fs-4 fw-bold">Welcome Back</p>
                        <i className="fa-regular fa-comments" style={{ color: "#ffffff", fontSize: "54px" }}></i>
                    </div>
                    <div className="col-md-7 py-4">
                        <div className="card-body">
                            <h5 className="card-title fw-bold fs-3">Log in</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                </div>
                                <button type="button" value="submit" onClick={handleSubmit} className="btn btn-dark mb-2" disabled={loading}>
                                    {loading ? 'Loading...' : 'Login'}
                                </button>

                                <p>Don't have an account? <Link to="/register">Register Here</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;