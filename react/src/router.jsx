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
import Estatisticas from "./viewsAdmin/Estatisticas.jsx";
//Cliente
import Contactos from "./viewsClientes/contactos.jsx";
import PaginaInicial from "./viewsClientes/PaginaInicial.jsx";
import Marcacoes from "./viewsClientes/marcacoes.jsx";
import Produtos from "./viewsClientes/produtos.jsx";
import PerfilMain from "./viewsClientes/perfilMain.jsx";
import Perfil from "./viewsClientes/Perfil.jsx"
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
          path: '/estatisticas',
          element: <Estatisticas/>
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
          path: '/marcacoes',
          element: <Marcacoes/>
        },
        {
          path: '/agenda',
          element: <Agenda/>
        },
        {
          path: '/produtos',
          element: <Produtos/>
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
        }
      ]
    },

    {
      path: "*",
      element: <NotFound/>
    }
  ])
  
  export default router;