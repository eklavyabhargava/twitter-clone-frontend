import { toast } from "react-toastify";

const UploadImage = ({ closeButtonRef, uploadProfilePic }) => {
  const toastId = "Toast12";

  const previewImg = (e) => {
    const imageElement = document.getElementById("selected-image");
    const file = e.target.files[0];

    // Check if a file is selected
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file.", {
          position: "bottom-right",
          toastId: toastId,
        });
        return;
      }

      // Check if the file size is within the limit (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          "File size exceeds 5MB limit. Please choose a smaller file.",
          {
            position: "bottom-right",
            toastId: toastId,
          }
        );
        return;
      }

      const reader = new FileReader();

      // Read the file as data URL
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          // Check if the image is square
          if (Math.abs(img.width - img.height) <= 10) {
            // Display the image in the preview
            imageElement.src = reader.result;
            imageElement.classList.remove("d-none");
          } else {
            toast.error("Please choose a square-shaped image.", {
              position: "bottom-right",
              toastId: toastId,
            });
          }
        };
      };

      reader.onerror = () => {
        console.error("Error reading the file.");
      };
    }
  };

  const clearSelectedImage = () => {
    const fileInput = document.getElementById("inputGroupFile02");
    const selectedImage = document.getElementById("selected-image");
    fileInput.value = "";
    selectedImage.src = "";
  };

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="staticBackdropLabel">
            Upload Profile Picture
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="alert alert-primary fw-semibold" role="alert">
            NOTE: The image should be square in shape and should be of 5MB or
            lesser
          </div>
          <div className="input-group w-full mb-3">
            <input
              type="file"
              required
              placeholder=""
              className="form-control"
              onChange={previewImg}
              accept="image/jpg, image/jpeg, image/png"
              id="inputGroupFile02"
            />
            <img
              id="selected-image"
              className="mt-3"
              alt=""
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={clearSelectedImage}
            className="px-3 py-2 bg-secBtn-bg hover:bg-secBtn-hover rounded text-btnText"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            onClick={uploadProfilePic}
            className="px-3 py-2 bg-btn-bg hover:bg-btn-hover text-btnText rounded"
          >
            Save Profile Pic
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
