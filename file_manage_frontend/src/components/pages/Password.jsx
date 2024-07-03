import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Navbar from '../layout/Navbar';
import { decodeJwt, getUserByEmail } from '../../service/authApi';
import axios from 'axios';
import Alert from '../layout/Alert';

function Password() {  
  const [person, setPerson] = useState({
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
  });
  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem('token');
  const [newPass, setNewPass] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass2, setNewPass2] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== newPass2) {
      setAlert({
        title: 'Password mismatch',
        body: 'New password and confirmation do not match.',
      });
      return;
    }
    try {
      const { id } = person;
      const data = {
        oldPassword: oldPass,
        newPassword: newPass
      };

      console.log("old pass "+oldPass);
      console.log("new pass "+newPass);

      await axios.put(`http://localhost:8080/api/v1/users/update/password/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({
        title: 'Password updated successfully!',
        body: 'Your password has been updated.',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setAlert({
        title: 'Error',
        body: 'There was an error updating your password. Please try again.',
      });
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
              <h2 className="text-2xl font-bold mb-8">Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-medium">Old Password</label>
                    <input 
                      type="password" 
                      name="oldPass"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)} 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                  <div>
                    <label className="block font-medium">New Password</label>
                    <input 
                      type="password" 
                      name="newPass"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)} 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Retype New Password</label>
                    <input 
                      type="password" 
                      name="newPass2"
                      value={newPass2}
                      onChange={(e) => setNewPass2(e.target.value)}
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

export default Password;
