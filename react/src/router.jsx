import {createBrowserRouter} from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Users from "./views/Users.jsx";
import UserForm from "./views/UserForm.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Stock from "./views/Stock.jsx";
import { Navigate } from "react-router-dom";
import Pedidos from "./views/Pedidos.jsx";
import Estatisticas from "./views/Estatisticas.jsx";

const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout/>,
      children: [
        {
          path: '/',
          element: <Navigate to="/users"/>
        },
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
          path: '/barbeiro',
          element: <barbeiro/>
        }
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