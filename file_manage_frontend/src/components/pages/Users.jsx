import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../layout/Navbar';
import { decodeJwt } from '../../service/authApi';
import { promote, demote, deleteUser } from '../../service/authApi';
import userPic from '../../assets/pics/userPic.png';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [person, setPerson] = useState(null);
  const token = localStorage.getItem('token');
  const [notification, setNotification] = useState(null);
  const [color, setColor] = useState('red');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const decoded = decodeJwt(token);
        const userEmail = decoded.sub;
        const response2 = await axios.get(`http://localhost:8080/api/v1/users/me/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerson(response2.data);
        const response = await axios.get('http://localhost:8080/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Data fetched is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  if (!person) {
    return <div>Loading...</div>;
  };

  const renderNotification = () => {
    if (!notification) return null;

    const colorClasses = {
      red: {
        bgColorClass: 'bg-red-100',
        borderColorClass: 'border-red-500',
        textColorClass: 'text-red-900',
        icon: (
          <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.293 8l1.414-1.414a1 1 0 0 0-1.414-1.414L16.586 6l-1.414-1.414a1 1 0 0 0-1.414 1.414L15.172 8l-1.414 1.414a1 1 0 1 0 1.414 1.414L16.586 10l1.414 1.414a1 1 0 1 0 1.414-1.414L17.293 8zm-7.778 8l-1.416-1.416a1 1 0 0 0-1.412 1.412L9.174 18l-1.416 1.416a1 1 0 0 0 1.412 1.412L10 19.826l1.416 1.416a1 1 0 0 0 1.412-1.412L10.826 18l1.416-1.416a1 1 0 0 0-1.412-1.412L10 16.174z"/>
          </svg>
        ),
      },
      teal: {
        bgColorClass: 'bg-teal-100',
        borderColorClass: 'border-teal-500',
        textColorClass: 'text-teal-900',
        icon: (
          <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
          </svg>
        ),
      },
    };

    const { bgColorClass, borderColorClass, textColorClass, icon } = colorClasses[color] || colorClasses.red;

    return (
      <div className={`${bgColorClass} border-t-4 ${borderColorClass} rounded-b ${textColorClass} px-4 py-3 shadow-md`} role="alert">
        <div className="flex">
          <div className="py-1">
            {icon}
          </div>
          <div>
            <p className="font-bold">{notification.message}</p>
          </div>
        </div>
      </div>
    );
  };

  const handlePromote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await promote(id, token);
      setNotification({
        type: 'success',
        message: 'User Promoted Successfully',
      });
      setColor('teal');

      // Delay for 1 second before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.log('error promoting user: ', e);
      setNotification({
        type: 'error',
        message: 'Failed to Promote User. Please try again later.',
      });
      setColor('red');
    }
  };

  const handleDemote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await demote(id, token);
      setNotification({
        type: 'success',
        message: 'User Demoted Successfully',
      });
      setColor('teal');
      
      // Delay for 1 second before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.log('error demoting user: ', e);
      setNotification({
        type: 'error',
        message: 'Failed to Demote User. Please try again later.',
      });
      setColor('red');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await deleteUser(id, token);
      setNotification({
        type: 'success',
        message: 'User Deleted Successfully',
      });
      setColor('teal');
      
      // Delay for 1 second before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (e) {
      console.log('error deleting user: ', e);
      setNotification({
        type: 'error',
        message: 'Failed to Delete User. Please try again later.',
      });
      setColor('red');
    }
  };

  const handleLastLogin = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${formattedHours}:${minutes} ${ampm} on ${day}-${month}-${year}`;
  }


  return (
    <div>
      <Navbar />
      {renderNotification()}
      <div className="container mx-auto px-4 sm:px-8 w-full">
        <div className="py-8">
          <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
            <h2 className="text-2xl leading-tight">Users</h2>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User Role
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Seen
                    </th>
                    {person.role !== 'MANAGER' && (
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.map(user => (
                    <tr key={user.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-full h-full rounded-full" src={user.profilePicture ? `data:image/jpeg;base64,${user.profilePicture}` : userPic} alt={user.username} />
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{user.firstName}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{user.lastName}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className={`relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight`}>
                          <span aria-hidden className={`absolute inset-0 bg-blue-200 opacity-50 rounded-full`}></span>
                          <span className="relative">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{handleLastLogin(user.lastLogin)}</p>
                      </td>
                      {person.role !== 'MANAGER' && (
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex mt-2">
                            <button onClick={() => handlePromote(user.id)} className="bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded mr-2">Promote</button>
                            <button onClick={() => handleDemote(user.id)} className="bg-zinc-600 hover:bg-zinc-800 text-white py-2 px-4 rounded mr-2">Demote</button>
                            {person.role !== 'CEO' && (
                              <button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded">Delete</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
