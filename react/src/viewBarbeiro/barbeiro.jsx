import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function barbeiro(){
    return (
        <div>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}/>
            <h1>Barbeiro</h1>
        </div>
    )
}