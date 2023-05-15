import {createBrowserRouter} from "react-router-dom";
import Login from "./viewsAdmin/Login.jsx";
import Signup from "./viewsAdmin/Signup.jsx";
import Users from "./viewsAdmin/Users.jsx";
import UserForm from "./viewsAdmin/UserForm.jsx";
import NotFound from "./viewsAdmin/NotFound.jsx";
import PaginaMain from "./components/PaginaMain.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Stock from "./viewsAdmin/Stock.jsx";
import Pedidos from "./viewsAdmin/Pedidos.jsx";
import EstatisticasBarbeiros from "./viewsAdmin/EstatisticasBarbeiros.jsx";
import EstatisticasProdutos from "./viewsAdmin/EstatisticasProdutos.jsx";
import AdicionarProduto from "./viewsAdmin/AdicionarProduto.jsx";
import ListaProdutos from "./viewsAdmin/ListaProdutos.jsx";
import VerMarcacoes from "./viewsAdmin/VerMarcacoes.jsx";

//Cliente
import Contactos from "./viewsClientes/contactos.jsx";
import PaginaInicial from "./viewsClientes/PaginaInicial.jsx";
import PaginaInicialOriginal from "./viewsClientes/PaginaInicialoriginal.jsx";
import Marcacoes from "./viewsClientes/marcacoes.jsx";
import Produtos from "./viewsClientes/produtos.jsx";
import PerfilMain from "./viewsClientes/perfilMain.jsx";
import Perfil from "./viewsClientes/Perfil.jsx"
import NovaMarcacao from "./viewsClientes/NovaMarcacao.jsx";
import Carrinho from "./viewsClientes/carrinho.jsx";
import Contactosguest from "./viewsClientes/ContactosGuest.jsx";
//barbeiro
import Agenda from "./viewsBarbeiro/agenda.jsx";


const router = createBrowserRouter([
    {
      path: '/',
      element: <PaginaMain/>,
      children: [
        {
          path: '/stock',
          element: <Stock/>
        },
        {
          path: '/users',
          element: <Users/>
        },
        {
          path: '/users/new',
          element: <UserForm key="userCreate" />
        },
        {
          path: '/users/:id',
          element: <UserForm key="userUpdate" />
        },
        {
          path: '/pedidos',
          element: <Pedidos/>
        },
        {
          path: '/listaProdutos',
          element: <ListaProdutos/>
        },
        {
          path: '/estatisticasBarbeiros',
          element: <EstatisticasBarbeiros/>
        },
        {
          path: '/estatisticasProdutos',
          element: <EstatisticasProdutos/>
        },
        {
          path: '/verMarcacoes',
          element: <VerMarcacoes/>
        },
        {
          path: '/adicionarProduto',
          element: <AdicionarProduto/>
        },
        {
          path: '/contactos',
          element: <Contactos/>
        },
        {
          path: '/paginainicial',
          element: <PaginaInicial/>
        },
        
        {
          path: '/marcacoes/:id',
          element: <Marcacoes key="userUpdate"/>
        },
        {
          path: '/novaMarcacao/:id',
          element: <NovaMarcacao key="userUpdate"/>
        },
        {
          path: '/agenda/:id',
          element: <Agenda key="userUpdate"/>
        },
        {
          path: '/produtos',
          element: <Produtos/>
        },
        {
          path: '/carrinho',
          element: <Carrinho/>
        },
        {
          path: '/perfilMain',
          element: <PerfilMain/>
        },
        {
          path: '/perfil/:id',
          element: <Perfil key="userUpdate" />
        },
      ]
    },
    



   
    {
      path: '/',
      element: <GuestLayout/>,
      children: [
        {
          path: '/login',
          element: <Login/>
        },
        {
          path: '/signup',
          element: <Signup/>
        },
        {
          path: '/paginainicialoriginal',
          element: <PaginaInicialOriginal/>
        },
        {
          path: '/contactosguest',
          element: <Contactosguest/>
        },
      ]
    },

    {
      path: "*",
      element: <NotFound/>
    }
  ])
  
  export default router;