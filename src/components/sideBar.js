import { NavLink, Link } from 'react-router-dom'
import './sideBar.css';

const SideBar = (props) => {
    // api url
    const API_URL = 'https://electric-blue-pelican-suit.cyclic.app';

    const userData = JSON.parse(localStorage.getItem('userData'));

    const logout = () => {
        localStorage.removeItem('userData');
        window.location = '/login';
    };

    return (
        <div className='card sticky-top sticky-sm-top' style={{ width: "100%", height: "100vh" }}>
            <div className='card-body d-flex'>
                <i className="fa-regular fa-comments ps-3" style={{ color: "#4297ff", fontSize: "34px" }}></i>
                <ul className="nav flex-column nav-pills align-content-start">
                    <li className="nav-item pt-4">
                        <NavLink to='/' className={({ isActive, isPending }) =>
                            isPending ? "nav-link fw-bold" : isActive ? "nav-link fw-bold active" : "nav-link fw-bold"}><i className="fa-solid fa-house pe-2" style={{ color: "#000000", fontSize: "23px" }}></i>Home</NavLink>
                    </li>
                    <li className="nav-item pt-2">
                        <NavLink to={`/profile/${userData.userId}`} className={({ isActive, isPending }) =>
                            isPending ? "nav-link fw-bold" : isActive ? "nav-link fw-bold active" : "nav-link fw-bold"}><i className="fa-solid fa-user pe-2" style={{ color: "#000000", fontSize: "23px" }}></i>Profile</NavLink>
                    </li>
                    <li className="nav-item pt-2">
                        <button className="nav-link fw-bold" onClick={logout}><i className="fa-solid fa-right-from-bracket pe-2" style={{ color: "#000000", fontSize: "23px" }}></i>Logout</button>
                    </li>
                </ul>
            </div>

            <Link to={`/profile/${userData.userId}`} style={{textDecoration: "inherit"}}>
                <div className="user-profile ps-3 pb-2">
                    <div className="profile-img mt-1"><img className='img-fluid rounded-circle' src={`${API_URL}/api/user/${props.userId}/profile-pic`} alt='' />
                    </div>
                    <div className='profileInfo'>
                        <p className='fw-bold fs-5 mb-1'>{props.name}</p>
                        <p>@{props.username}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default SideBar