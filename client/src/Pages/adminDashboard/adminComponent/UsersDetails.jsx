import { useEffect, useState } from "react";
import axios from "axios";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const UsersDetails = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/getAllUsersToAdmin");
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-color uppercase">
          Users Details
        </h1>
        <Link to={"/admin/dashboard"}>
        <MdDashboard className="text-[24px] cursor-pointer" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-lg">
                Name
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-lg">
                Email
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-lg">
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`bg-white ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.fullname}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {user.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersDetails;
