import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client.js';

export default function UserDropdown() {
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('Todos'); // Updated default option value
  const [userNames, setUserNames] = useState([]);
  const [barbeiroUsers, setBarbeiroUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get('/users?tipo=Barbeiro')
      .then(({ data }) => {
        setLoading(false);
        const barbeiroUsers = data.data.filter(user => user.tipo === 'Barbeiro');
        const names = barbeiroUsers.map(user => user.name);
        setUsersList(names);
        setUserNames(names);
        setBarbeiroUsers(barbeiroUsers);
        console.log('Filtered users:', barbeiroUsers);
        console.log('User names:', names);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const filteredUsers = selectedUser === 'Todos' ? barbeiroUsers : barbeiroUsers.filter(user => user.name === selectedUser);

  return (
    <div>
      <select
        name="ordenar1"
        style={{ textAlign: 'center' }}
        value={selectedUser}
        onChange={e => setSelectedUser(e.target.value)}
      >
        <option value="Todos">Todos</option>
        {userNames.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>



      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Barbeiro</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
