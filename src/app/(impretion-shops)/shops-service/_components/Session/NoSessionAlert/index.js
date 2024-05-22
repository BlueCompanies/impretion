import { MdCancel } from "react-icons/md";

export default function NoSessionAlert() {
  
  return (
    <div style={{position:"fixed", 
    background:"red", 
    zIndex:999999, 
    width:"100%", 
    padding:"5px", 
    display:"flex", 
    justifyContent:"center", 
    fontSize:"12px", 
    backgroundColor:"red", 
    color:"#fff"
    }}>
      <div style={{height:"100%", display:"flex", justifyContent:"center"}}>
      <MdCancel />
      </div>
      <p>Esta sesión caducó, por favor vuelve a scanear el QR.</p>
    </div>
  );
}
