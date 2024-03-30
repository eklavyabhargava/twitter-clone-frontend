import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

function SearchModal({ users, onClose, searchTerm }) {
  const navigate = useNavigate();

  const navigateToProfile = (userId) => {
    if (userId) {
      navigate(`/profile?userId=${userId}`);
      onClose();
    }
  };

  return (
    <Modal.Body>
      <div>
        {users?.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-row items-center mb-3 cursor-pointer"
              onClick={() => navigateToProfile(user._id)}
            >
              <img
                className="img-fluid h-[40px] rounded-3xl mr-2"
                src={user.profilePic}
                alt=""
              />
              <div>
                <p>{user.name}</p>
                <p>{user.username}</p>
              </div>
            </div>
          ))
        ) : searchTerm ? (
          <p>No users found</p>
        ) : null}
      </div>
    </Modal.Body>
  );
}

export default SearchModal;
