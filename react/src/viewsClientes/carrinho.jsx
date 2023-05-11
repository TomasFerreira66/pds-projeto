export default function Carrinho(){
    return (
        <div style={{ marginLeft: "100px", marginRight: "100px" }}>
          <h2>Carrinho de compras</h2>
          <br />
          <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          </div>
        </div>
      );  
}