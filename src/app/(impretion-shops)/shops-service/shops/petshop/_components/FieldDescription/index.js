import { MdInfo } from "react-icons/md";

export const runtime = "edge";

export default function FieldDescription({ children }) {
  return (
    <div
      style={{
        background: "#8C52FF",
        color: "#fff",
        marginBottom: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        padding: "5px",
      }}
    >
      <div
        style={{
          color: "#555555",
          fontSize: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        <div>
          <MdInfo style={{ fontSize: "17px", marginRight: "5px" }} />
        </div>
        <p>{children}</p>
      </div>
    </div>
  );
}
