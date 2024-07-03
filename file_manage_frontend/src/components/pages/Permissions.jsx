import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import { decodeJwt, getUserByEmail } from '../../service/authApi';

// Define roles and permissions
const rolesPermissions = {
  EMPLOYEE: new Set(["file:create", "file:read", "file:update", "file:download", "user:me", "user:update"]),
  MANAGER: new Set(["file:create", "file:read", "file:update", "file:download", "user:read", "user:me", "user:update"]),
  CEO: new Set(["file:create", "file:read", "file:update", "file:delete", "file:download", "user:read", "user:update", "user:me"]),
  ADMIN: new Set(["file:create", "file:read", "file:update", "file:delete", "file:download", "user:read", "user:update", "user:delete", "user:me"])
};

// Map permissions to human-readable labels
const permissionLabels = {
  "file:create": "Create Files",
  "file:read": "Read Files",
  "file:update": "Update Files",
  "file:delete": "Delete Files",
  "file:download": "Download Files",
  "user:read": "Read Users",
  "user:update": "Update Users",
  "user:me": "Manage Own Account",
  "user:delete": "Delete Users"
};

function Permissions() {
  const [person, setPerson] = useState(null);
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

  // determine role, if person is null , role becomes undefined
  const role = person?.role;

  //if person is empty or null, permissions becomes an empty set
  const permissions = rolesPermissions[role] || new Set();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar />
          <div className="w-full md:w-3/4">
            <div className="border-2 border-gray-600 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-8">Permissions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <p className="block font-medium">Your Role is <span className="font-bold">{role}</span></p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="block font-medium mb-2">Permissions for your role:</p>
                  <div className="border border-gray-600 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-2">
                      {Array.from(permissions).map(permission => (
                        <li key={permission} className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>{permissionLabels[permission]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Permissions;
