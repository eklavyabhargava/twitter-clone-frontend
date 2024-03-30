const Loading = ({ width, height }) => {
  return (
    <div
      style={{
        width: width ?? "100%",
        height: height ?? "100vh",
        alignItems: "center",
      }}
      className="d-flex justify-content-center"
    >
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
