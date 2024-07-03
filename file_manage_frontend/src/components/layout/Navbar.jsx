import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { decodeJwt } from '../../service/authApi';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const decoded = decodeJwt(token);
        const userEmail = decoded.sub;

        const response = await axios.get(`http://localhost:8080/api/v1/users/me/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;
        setUserRole(user.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Redirect to /dashboard if there is an error
        navigate('/dashboard');
      }
    };

    if (token) {
      fetchUserRole();
    } else {
      // Redirect to /dashboard if there is no token
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleUsersSee = () => {
    // If user does not have the required role, redirect to /dashboard
    if (!['MANAGER', 'CEO', 'ADMIN'].includes(userRole)) {
      console.log(userRole);
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-wrap place-items-center">
      <section className="relative mx-auto">
        {/* <!-- navbar --> */}
        <nav className="flex justify-between bg-gray-900 text-white w-screen">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <a className="text-3xl font-bold font-heading" href="#">
              {/* <img className="h-9" src="" alt="logo">  */}
              LOGO.
            </a>
            {/* <!-- Nav Links --> */}
            <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
              <li><Link className="hover:text-gray-200" to="/dashboard">Home</Link></li>
              {/* <li><Link className="hover:text-gray-200" to="/MyDocs">MyDocuments</Link></li> */}
              {userRole != "EMPLOYEE" && (
                <li onClick={handleUsersSee}><Link className="hover:text-gray-200" to="/UsersView">Users</Link></li>
              )}
            </ul>

            {/* <!-- Header Icons --> */}
            <div className="hidden xl:flex itemsCenter space-x-5 items-center">
              {/* <!--  UserSettings --> */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center hover:text-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                    <Link to="/password" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Password</Link>
                    <Link to="/permissions" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Permissions</Link>
                    <button onClick={handleLogout} className="block px-4 py-2 bg-zinc-300 text-gray-800 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <!-- Responsive navbar --> */}
        </nav>
      </section>
    </div>
  );
}

export default Navbar;
