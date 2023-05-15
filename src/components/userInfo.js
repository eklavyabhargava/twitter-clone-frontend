import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const UserInfo = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const { getuserId } = useParams();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [dob, setDob] = useState('');
    const [userInfo, setUserInfo] = useState([]);

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

    const toastId = "customID1";
    const toastId2 = "customID2";

    const closeButtonRef = useRef();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location = '/login';
    }
    const token = userData?.token;
    const userId = userData?.userId;

    // handle follow request
    const handleFollow = async () => {
        const followingId = userInfo._id;

        try {
            const response = await axios.put(`${API_URL}/api/user/${followingId}/follow`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success('Followed', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
                getUserInfo(getuserId);
            } else {
                // handle all other status codes
                toast.error(response.data.Error || 'Unexpected error occurred', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId2
                });
            }

        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId2
            });
        }
    }

    // handle unfollow request
    const handleUnfollow = async () => {
        const followingId = userInfo._id;

        try {
            const response = await axios.put(`${API_URL}/api/user/${followingId}/unfollow`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success('Unfollowed', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId
                });
                getUserInfo(getuserId);
            } else {
                // handle all other status codes
                toast.error(response.data.Error || 'Unexpected error occurred', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId2
                });
            }
        } catch (error) {
            console.log(error.response.data.error);
            toast.error(error.response.data.Error || "Some Error Occurred!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId2
            });
        }
    };

    // get user detail
    const getUserInfo = async (userId) => {
        const data = await props.getUserProfile(userId);
        setUserInfo(data);
    };

    // call function: getUserInfo
    useEffect(() => {

        getUserInfo(getuserId);
        // eslint-disable-next-line
    }, [getuserId])

    // request to change profile info
    const editProfile = async () => {
        if (!name || !location || !dob) {
            toast.error("Mandatory fields are missing!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId2
            });
        } else {
            try {
                const response = await axios.put(`${API_URL}/api/user/${userId}`, {
                    name,
                    location,
                    dob
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    console.log(response.data.Succees);
                    toast.success(response.data.Success, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId
                    });
                    getUserInfo(getuserId);
                    closeButtonRef.current.click();
                } else {
                    toast.error(response.data.Error || "Some Error Occurred!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId2
                    });
                }
            } catch (error) {
                console.log(error.response.data.Error);
                toast.error(error.response.data.Error || "Some Error Occurred!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId2
                });
            }
        }
    }

    // upload profile picture
    const uploadProfilePic = async () => {
        const imgFile = document.querySelector('#inputGroupFile02').files[0];

        if (!imgFile) {
            toast.error('No file chosen!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 500,
                toastId: toastId
            });
        } else {
            const formData = new FormData();
            formData.append('profilePic', imgFile);

            try {
                const response = await axios.post(`${API_URL}/api/user/${getuserId}/uploadProfilePic`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    console.log(response.data.Succees);
                    toast.success(response.data.Success, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId
                    });
                    window.location.reload(true);
                } else {
                    toast.error(response.data.Error || "Some Error Occurred!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 500,
                        toastId: toastId2
                    });
                }
                closeButtonRef.current.click();
            } catch (error) {
                console.log(error.response.data.Error);
                toast.error(error.response.data.Error || "Some Error Occurred!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 500,
                    toastId: toastId2
                });
                closeButtonRef.current.click();
            }
        }
    }

    return (
        <>
            <ToastContainer />
            {userInfo && userInfo._id === userId ?
                <div className="position-absolute top-0 end-0">
                    <button type="button" className="btn btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">Upload Profile Photo</button>
                    <button type="button" className="btn btn-outline-secondary ms-2 me-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                </div> :
                <button type="button" onClick={() => { userInfo.followers && userInfo?.followers.includes(userId) ? handleUnfollow() : handleFollow() }} className="follow-btn btn btn-dark me-2 position-absolute top-0 end-0">
                    {userInfo?.followers && userInfo?.followers.includes(userId) ? "Following" : "Follow"}
                </button>
            }

            <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Upload Profile Pic</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-primary fw-semibold" role="alert">
                                NOTE: The image should be square in shape
                            </div>
                            <div className="input-group mb-3">
                                <input type="file" required className="form-control" onChange={previewImg} accept='image/jpg, image/jpeg, image/png' id="inputGroupFile02" />
                                <img id="selected-image" className="mt-3" alt="" style={{ maxWidth: '100%' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button ref={closeButtonRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={uploadProfilePic} className="btn btn-primary">Save Profile Pic</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Profile</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label for="name" className="form-label">Name </label>
                                <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} className="form-control" id="name" placeholder={userInfo?.name} />
                            </div>
                            <div className="mb-3">
                                <label for="location" className="form-label">Location</label>
                                <input type="text" value={location} onChange={(e) => { setLocation(e.target.value) }} className="form-control" id="location" placeholder={userInfo?.location} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dob" className="form-label">Date of Birth</label>
                                <input type="date" value={dob} onChange={(e) => { setDob(e.target.value) }} className="form-control" id="dob" placeholder={userInfo?.dob} max={new Date().toISOString().split("T")[0]} />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={closeButtonRef} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => { editProfile() }}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <p className='mb-0 fw-bold fs-5'>{userInfo?.name}</p>
            <p className='fs-5 mb-0' style={{ color: "#5a5a5a" }}>@{userInfo?.username}</p>
            <div className='mt-3 mb-1'>
                <i className="fa-solid fa-calendar" style={{ color: "#333333" }}></i><span style={{ color: "#535353" }}> DOB: {userInfo?.dob ? new Date(userInfo?.dob).toDateString() : null}</span>
                <i className="ms-4 fa-solid fa-location-dot" style={{ color: "#333333" }}></i><span style={{ color: "#535353" }}> Location: {userInfo?.location}</span>
            </div>
            <i className="fa-regular fa-calendar" style={{ color: "#333333" }}></i><span style={{ color: "#535353" }}> Joined {new Date(userInfo?.createdAt).toDateString()}</span>
            <div className='mt-3 d-flex flex-row fw-bold'>
                <p className='me-3'>{userInfo?.following?.length} Followings</p>
                <p>{userInfo?.followers?.length} Followers</p>
            </div>
        </>
    );
}

export default UserInfo;