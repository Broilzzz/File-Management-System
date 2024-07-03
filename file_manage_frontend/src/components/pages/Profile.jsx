import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import { decodeJwt, getUserByEmail } from '../../service/authApi';
import axios from 'axios';
import Alert from '../layout/Alert';

function Profile() {  
  const [person, setPerson] = useState({
    id: undefined,
    password: ''
  });
  const [alert, setAlert] = useState(null);
  const [newPass, setNewPass] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decoded = decodeJwt(token);
        const userEmail = decoded.sub;
        const response = await getUserByEmail(userEmail);
        setPerson(response);
      } catch (error) {
        console.error("error getting user: ", error);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id,  } = person;
      await axios.put(`http://localhost:8080/api/v1/users/update/password${id}`, null, {
        params: {  },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({
        title: 'Profile updated successfully!',
        body: 'Your profile information has been updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar />
          <div className="w-full md:w-3/4">
            <div className="border-2 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-8">Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">First name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={person.firstName} 
                      onChange={handleChange} 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Last name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={person.lastName} 
                      onChange={handleChange} 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-medium">Email address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={person.email} 
                      onChange={handleChange} 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mt-4"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
