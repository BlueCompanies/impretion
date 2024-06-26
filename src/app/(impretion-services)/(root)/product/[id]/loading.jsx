import BasicLoader from "@/app/_components/Loaders/Loader";

export default function ProductDetailLoading() {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <BasicLoader/>
      </div>
    );
  }
  