import { useState } from 'react';

export default function Produtos(){
    const [carrinho, setCarrinho] = useState([]);
    const [quantidade, setQuantidade] = useState(1);
    const produtos = [
        { id: 1, nome: "Pomada modeladora", descricao: "Para cabelos masculinos", preco: 20.00 },
        { id: 2, nome: "Óleo para barba", descricao: "Hidrata e amacia a barba", preco: 30.00 },
        { id: 3, nome: "Shampoo para barba", descricao: "Limpa e refresca a barba", preco: 15.00 },
    ];

    const adicionarAoCarrinho = (produto, quantidade) => {
        const itemCarrinho = {
            produto,
            quantidade,
            precoTotal: produto.preco * quantidade
        };
        setCarrinho([...carrinho, itemCarrinho]);
    };

    return (
        <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <h2>Produtos</h2>
            </div>
            <div style={{display: 'flex', flexWrap: "wrap", justifyContent: "center"}}>
                {produtos.map(produto => (
                    <div key={produto.id} style={{padding: "20px", display: "flex", flexDirection: "column"}}>
                        <h3>{produto.nome}</h3>
                        <p>{produto.descricao}</p>
                        <p><strong>Preço:</strong> € {produto.preco.toFixed(2)}</p>
                        <label>
                            Quantidade: {' '}
                            <input name="quanti" type="number" min="1" defaultValue="1" onChange={(e) => setQuantidade(Number(e.target.value))} />
                        </label>
                        <button style={{marginTop: "10px"}} onClick={() => adicionarAoCarrinho(produto, quantidade)}>Adicionar ao Carrinho</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
