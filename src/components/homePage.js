import axios from 'axios';
import React, { useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './homePage.css';
import Tweet from '../components/tweets';

const HomePage = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const [content, setContent] = useState('');

    const closeButtonRef = useRef();

    const customId = "customId1";
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location = '/login';
    }

    const token = userData?.token;

    // preview image in modal
    const previewImg = (e) => {
        const imageElement = document.getElementById("selected-image");

        const file = e.target.files[0];
        const reader = new FileReader();
        try {
            reader.readAsDataURL(file);
            reader.onload = () => {
                imageElement.src = reader.result;
                imageElement.classList.remove('d-none');
            };
        } catch (error) {
            console.log(error);
        }
    };

    const handleTweet = () => {
        const loading = toast.loading('Loading...', { toastId: customId });

        // check for blank content msg
        if (content === '') {
            toast.update(loading, { render: `Content Message is blank.`, type: "error", isLoading: false, autoClose: 500 });
        } else {
            // get the image file from input element
            const imgFile = document.querySelector("#formFile").files[0];

            // create formData object to store both file and tweet msg
            const formData = new FormData();

            // append content to formData
            formData.append('content', content);

            // append image file if available
            if (imgFile) {
                formData.append('image', imgFile);
            }

            axios.post(`${API_URL}/api/tweet`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                toast.update(loading, { render: `Tweet Posted`, type: "success", isLoading: false, autoClose: 500 });
                closeButtonRef.current.click();
            }).catch(error => {
                toast.update(loading, { render: `Cannot Post Tweet`, type: "error", isLoading: false, autoClose: 500 });
                closeButtonRef.current.click();
                console.log(error);
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='mt-1 pt-1'>
                <div>
                    <div className='d-flex justify-content-between'>
                        <p className='fw-bold fs-4'>Home</p>
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Tweet
                        </button>

                        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">New Tweet</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <textarea className="form-control" value={content} onChange={(e) => { setContent(e.target.value) }} id="message-text"></textarea>
                                            </div>
                                            <div className="mb-3 ps-2">
                                                <label for="formFile" className="form-label"><i className="fa-regular fa-image fa-lg" style={{ color: "#000000" }}></i></label>
                                                <input className="form-control d-none" type="file" onChange={previewImg} accept='image/jpg, image/jpeg, image/png' id="formFile" />
                                                <img id="selected-image" className="mt-3" alt="" style={{ maxWidth: '100%' }} />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" ref={closeButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="button" onClick={handleTweet} className="btn btn-primary">Tweet</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Tweet tweetDetailPage={props.tweetDetailPage} handleLike={props.handleLike} getProfile={props.getProfile} handleRetweet={props.handleRetweet} handleDelete={props.handleDelete} />
            </div>
        </>
    )
}

export default HomePage;