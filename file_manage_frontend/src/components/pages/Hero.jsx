import React from 'react';
import { Link } from 'react-router-dom';
import SVG from '../../assets/svg/Business_SVG.svg';
function Hero() {
  return (
    <section className="dark:bg-gray-100 dark:text-gray-800 h-screen">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-10xl font-bold leading-none sm:text-6xl">File        
            <span className="dark:text-violet-600">   Management </span>System
          </h1>
          <p className="mt-6 mb-8 text-2xl sm:mb-12">A way for users to share and download files and documents.
            <br  className="hidden md:inline lg:hidden" /> Join Now!
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link rel="noopener noreferrer" to="/signup"  className="px-20 py-3 text-lg font-semibold rounded dark:bg-violet-600 dark:text-gray-50">Signup</Link>
            <Link rel="noopener noreferrer" to="/signin"  className="px-20 py-3 text-lg font-semibold border rounded dark:border-gray-800">Login</Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <img src={SVG} alt="" className="object-contain w-80 sm:w-96 lg:w-128 xl:w-144 2xl:w-160" />
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <p className='font text-sm mt-20'>made by ahil</p>
      </div>
    </section>
  )
}

export default Hero