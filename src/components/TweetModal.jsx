import { useState } from "react";

const TweetModal = ({ closeButtonRef, handleTweet }) => {
  const [content, setContent] = useState("");

  // preview image in modal
  const previewImg = (e) => {
    const imageElement = document.getElementById("selected-image");

    const file = e.target.files[0];
    const reader = new FileReader();
    try {
      reader.readAsDataURL(file);
      reader.onload = () => {
        imageElement.src = reader.result;
        imageElement.classList.remove("d-none");
      };
    } catch (error) {}
  };

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="exampleModalLabel">
            New Tweet
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <textarea
                className="form-control"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                id="message-text"
              ></textarea>
            </div>
            <div className="mb-3 ps-2">
              <label htmlFor="formFile" className="form-label">
                <i
                  className="fa-regular fa-image fa-lg"
                  style={{ color: "#000000" }}
                ></i>
              </label>
              <input
                className="form-control d-none"
                type="file"
                onChange={previewImg}
                accept="image/jpg, image/jpeg, image/png"
                id="formFile"
              />
              <img
                id="selected-image"
                className="mt-3"
                alt=""
                style={{ maxWidth: "100%" }}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            ref={closeButtonRef}
            className="bg-secBtn-bg hover:bg-secBtn-hover text-white p-2 rounded"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleTweet}
            className="bg-btn-bg hover:bg-btn-hover px-3 py-2 rounded text-white"
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetModal;
