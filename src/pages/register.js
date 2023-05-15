import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './login.css';
import axios from 'axios';

const Register = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const customId1 = "customId1";
    const customId2 = "customId2";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name: name,
                email: email,
                username: username,
                password: password
            });
            setLoading(false);
            toast.success('Registered Successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                toastId: customId1
            });
            console.log(response);
            window.location = '/login';
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.Error, {
                position: toast.POSITION.TOP_RIGHT,
                toastId: customId2
            });
            console.log(error.response.data.Error);
        }
        setLoading(false);
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
                        <p className="fs-4 fw-bold">Join Us</p>
                        <i className="fa-regular fa-comments" style={{ color: "#ffffff", fontSize: "54px" }}></i>
                    </div>
                    <div className="col-md-7 py-4">
                        <div className="card-body">
                            <h5 className="card-title fw-bold fs-3">Register</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                </div>
                                <button type="button" value="submit" onClick={handleSubmit} className="btn btn-dark mb-2" disabled={loading}>
                                    {loading ? 'Loading...' : 'Register'}
                                </button>

                                <p>Already Registered? <Link to="/login">Login Here</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;