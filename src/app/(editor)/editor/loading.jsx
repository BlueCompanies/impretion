import CommonLoader from "@/app/_components/Loaders/CommonLoader";

export default function EditorLoading() {
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
          background: "white",
        }}
      >
        <CommonLoader/>
      </div>
    );
  }
  