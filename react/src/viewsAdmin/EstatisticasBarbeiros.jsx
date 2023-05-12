import React, { useState, useEffect } from 'react';
import axiosClient from "../axios-client.js";

export default function UserDropdown() {
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    axiosClient.get('/users?tipo=Barbeiro')
      .then(({ data }) => {
        setLoading(false);
        const barbeiroUsers = data.data.filter(user => user.tipo === 'Barbeiro');
        const names = barbeiroUsers.map(user => user.name);
        setUsersList(names);
        setUserNames(names);
        console.log('Filtered users:', barbeiroUsers);
        console.log('User names:', names);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="text-center">
      <h3 className="mb-4">Barbeiro</h3>
      <select className="btn-marcacao" style={{textAlign: "center"}} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        {userNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
    </div>
  );
}