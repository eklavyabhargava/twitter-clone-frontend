const EditProfileModal = ({
  userInfo,
  setUserInfo,
  closeButtonRef,
  editProfile,
}) => {
  const handleDataChange = ({ target: { name, value } }) => {
    setUserInfo((currData) => {
      return { ...currData, [name]: value };
    });
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
              value={userInfo?.name}
              onChange={(e) => handleDataChange(e)}
              className="form-control"
              id="name"
              placeholder={userInfo?.name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={userInfo?.location}
              onChange={(e) => handleDataChange(e)}
              className="form-control"
              id="location"
              placeholder={userInfo?.location}
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
                userInfo?.dob
                  ? new Date(userInfo.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleDataChange(e)}
              className="form-control"
              id="dob"
              placeholder={userInfo?.dob}
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
            className="px-3 py-2 bg-btn-bg hover:bg-btn-hover text-btnText rounded"
            onClick={() => {
              editProfile();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
