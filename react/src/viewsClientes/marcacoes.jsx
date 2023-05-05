export default function marcacoes(){
    return (
      <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}/>
          <h2>Marcações</h2>
          <br /><br /><br />
          <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginTop: '20px'}}>
          <h4>Selecionar serviço:</h4>
        </div>
        <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginTop: '20px'}}>
          <h4>Selecionar barbeiro:</h4>
        </div>
        <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginTop: '20px'}}>
          <h4>Selecionar data e hora:</h4>
        </div>
        <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginTop: '20px'}}>
            <button className="btn-marcacao">Confirmar marcação</button>
        </div>
      </div>
    )
  }
  