import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const EditProfileModal = ({
  userInfo,
  setUserInfo,
  closeButtonRef,
  editProfile,
  isUpdatingInfo,
}) => {
  const [newData, setData] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setData((currData) => {
      return { ...currData, [name]: value };
    });
  };

  useEffect(() => {
    setData(userInfo ?? {});
  }, [userInfo, closeButtonRef]);

  const handleSave = () => {
    setUserInfo((currData) => {
      return { ...currData, ...newData };
    });

    editProfile();
  };

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="staticBackdropLabel">
            Edit Profile
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name{" "}
            </label>
            <input
              type="text"
              name="name"
              value={newData?.name}
              onChange={(e) => handleChange(e)}
              className="form-control"
              id="name"
              placeholder={newData?.name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={newData?.location}
              onChange={(e) => handleChange(e)}
              className="form-control"
              id="location"
              placeholder={newData?.location}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={
                newData?.dob
                  ? new Date(newData.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleChange(e)}
              className="form-control"
              id="dob"
              placeholder={newData?.dob}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            ref={closeButtonRef}
            className="px-3 py-2 bg-secBtn-bg hover:bg-secBtn-hover rounded text-btnText"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            disabled={isUpdatingInfo}
            className="px-3 py-2 bg-btn-bg hover:bg-btn-hover text-btnText rounded"
            onClick={handleSave}
          >
            {isUpdatingInfo ? (
              <Spinner animation="grow" size="sm" variant="light" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
