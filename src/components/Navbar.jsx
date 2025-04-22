import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.name) {
      setCurrentUserName(user.name);
    }

    const fetchAllergies = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/allergens", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllergies(data.allergens || []);
      } catch (error) {
        console.error("Failed to fetch allergies", error);
      }
    };

    if (token) {
      fetchAllergies();
    }
  }, [token, user]);

  const handleUserIconClick = () => {
    setShowForm(!showForm);
    setShowAllergyForm(false);
  };

  const handleAllergyClick = () => {
    setShowAllergyForm(true);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddAllergy = async (e) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;

    let updatedAllergies = [...allergies];

    if (editingIndex !== null) {
      updatedAllergies[editingIndex] = newAllergy;
      setEditingIndex(null);
    } else {
      updatedAllergies.push(newAllergy);
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/allergens", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: updatedAllergies }),
      });

      if (!res.ok) throw new Error("Failed to update allergies");

      setAllergies(updatedAllergies);
      setNewAllergy("");
    } catch (error) {
      console.error("Failed to update allergies", error);
    }
  };

  const handleDeleteAllergy = async (allergyToDelete) => {
    const filtered = allergies.filter((a) => a !== allergyToDelete);

    try {
      const res = await fetch("http://localhost:5000/api/user/allergens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: [allergyToDelete] }),
      });

      if (!res.ok) throw new Error("Failed to delete allergy");

      setAllergies(filtered);
    } catch (error) {
      console.error("Failed to delete allergy", error);
    }
  };

  const handleEditAllergy = (index) => {
    setNewAllergy(allergies[index]);
    setEditingIndex(index);
  };

  return (
    <nav className="flex items-center justify-between py-6 fixed w-full bg-black shadow-md px-6 z-10">
      <div className="flex items-center">
        <img
          src="SafeEats_logo.png"
          alt="SafeEats Logo"
          className="h-12 w-12 rounded-full border-2 border-red-500"
        />
        <span className="ml-3 text-2xl font-semibold text-white">
          SafeEats: Because Every Bite Matters!
        </span>
      </div>
      <div className="relative">
        <button
          className="text-gray-600 hover:text-red-500 focus:outline-none"
          onClick={handleUserIconClick}
        >
          <i className="cursor-pointer rounded-full bg-black text-2xl items-center border-1 border-red-400">
            🧑‍🍳
          </i>
        </button>

        {showForm && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold text-xl mb-2 text-center">
                  {currentUserName || "User"}
                </label>
              </div>
              <div>
                <button
                  type="button"
                  className="items-center w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer mb-2"
                  onClick={handleAllergyClick}
                >
                  Allergies
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="items-center w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        )}

        {showAllergyForm && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4">
            <form className="space-y-4" onSubmit={handleAddAllergy}>
              <div>
                <label className="block text-gray-700 font-bold text-xl mb-2 text-center">
                  Manage Allergies
                </label>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newAllergy}
                  placeholder="Add or Edit an allergy"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 text-white bg-blue-500 p-2 rounded-lg cursor-pointer"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
              <div>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {allergies.map((allergy, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{allergy}</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEditAllergy(index)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteAllergy(allergy)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
