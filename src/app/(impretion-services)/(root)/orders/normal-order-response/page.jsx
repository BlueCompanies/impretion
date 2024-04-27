"use client"

import { useSearchParams } from 'next/navigation'
export const runtime = "edge";

export default function NormalOrderResponse () {
    const searchParams = useSearchParams()
 
  console.log(searchParams.get("extra3"))

  function formatPrice(price) {
    // Convert price to a number and then to a string with 2 decimal places
    const formattedPrice = Number(price).toFixed(2);
  
    // Remove trailing zeros and decimal point if all decimal places are zeros
    const trimmedPrice = formattedPrice.replace(/\.?0+$/, '');
  
    // Add a comma for thousands separator
    const formattedPriceWithComma = trimmedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return formattedPriceWithComma;
  }
  

    return(
        <>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%", backgroundColor:"#428bff", height:"200px"}}>
            <h1 style={{fontSize:"40px", fontWeight:700, color:"#fff"}}>GRACIAS POR TU COMPRA</h1>
        </div>
        <div style={{margin:"30px", width:"100%", display:"flex", justifyContent:"center"}}>
            <div style={{width:"50%"}}>
                <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #fce03d", borderRadius:"4px"}}>{searchParams.get("extra2")}</p>
                <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #fce03d", borderRadius:"4px", fontSize:"25px"}}>{formatPrice(searchParams.get("TX_VALUE"))} COP</p>
                <hr/>
                <div style={{width:"100%", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px"}}>TUS DATOS</p>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #c2d9ff", borderRadius:"4px"}}>{searchParams.get("extra3")}</p>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #c2d9ff", borderRadius:"4px"}}>{searchParams.get("buyerEmail")}</p>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #c2d9ff", borderRadius:"4px"}}>{searchParams.get("telephone")}</p>
                </div>
                <hr/>
                <div style={{width:"100%", display:"flex", justifyContent:"center", flexDirection:"column"}}>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px"}}>DATOS DE ORDEN</p>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #c2d9ff", borderRadius:"4px"}}>Número de orden: {searchParams.get("referenceCode")}</p>
                    <p style={{display:"flex", justifyContent:"center", alignItems:"center", height:"40px", border:"1px solid #c2d9ff", borderRadius:"4px"}}>Fecha: {searchParams.get("processingDate")}</p>
                    
                </div>
            </div>
        </div>
        </div>
        </>
    )
}