import React, { useState } from 'react';
import pic from '../../assets/pics/signup.png'
import { register } from '../../service/authApi';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    if(!validateForm()) return;
    try {
      await register({ firstName, lastName, email, password });
      setSuccess('Verification Email has been sent to your email.');
      setMessage('');
    } catch (error) {
      setMessage('Failed to register. Please try again.');
      setSuccess('');
    }
  };


  const validateForm = () => {
    let formErrors = {};

    if (!firstName) {
      formErrors.firstName = 'First name is required';
    }
    if (!lastName) {
      formErrors.lastName = 'Last name is required';
    }
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email address is invalid';
    }
    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
      <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: '1000px' }}>
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 dark:bg-violet-900 py-10 px-10">
            {/* SVG Content */}
            <img src={pic} alt="" className='w-100 pt-20'/>
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">REGISTER</h1>
              <p>Enter your information to register</p>
            </div>
            <div>
              <div className="flex -mx-3">
                <div className="w-1/2 px-3 mb-5">
                  <label htmlFor="first-name" className="text-xs font-semibold px-1">First name</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                    </div>
                    <input 
                      type="text" 
                      className={`w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-indigo-500`} 
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                </div>
                <div className="w-1/2 px-3 mb-5">
                  <label htmlFor="last-name" className="text-xs font-semibold px-1">Last name</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                    </div>
                    <input 
                      type="text" 
                      className={`w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-indigo-500`}  
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label htmlFor="email" className="text-xs font-semibold px-1">Email</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                    </div>
                    <input 
                      type="email" 
                      className={`w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-indigo-500`}  
                      placeholder="johnsmith@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                  <label htmlFor="password" className="text-xs font-semibold px-1">Password</label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                    </div>
                    <input 
                      type="password" 
                      className={`w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} outline-none focus:border-indigo-500`}  
                      placeholder="************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {errors.password && <p className='text-red-500 text-xs italic'>{errors.password}</p>}
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button 
                    className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                    onClick={handleRegister}
                  >
                    REGISTER NOW
                  </button>
                  <p className=''>Already have an account? </p>
                  <Link to="/signin" className='text-blue-600'>Login</Link>
                  {message && <p className="mt-2 text-center text-red-600">{message}</p>}
                  {success && <p className="mt-2 text-center text-green-600">{success}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
