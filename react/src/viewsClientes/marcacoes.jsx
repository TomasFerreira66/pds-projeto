import {Link} from "react-router-dom";

export default function marcacoes() {


  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Marcações</h1>
        <Link className="btn-add" to="/novaMarcacao">Add new</Link>
      </div>
    </div>
  )
}