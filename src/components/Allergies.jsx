import React, { useState, useEffect } from "react";

const Allergies = () => {
  const [allergy, setAllergy] = useState("");
  const [allergyList, setAllergyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch existing allergens on component mount
  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/allergens", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAllergyList(data.allergens || []);
        } else {
          console.error(data.message || "Failed to fetch allergens");
        }
      } catch (error) {
        console.error("Error fetching allergens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllergens();
  }, [token]);

  // Add an allergen
  const handleAddAllergy = async () => {
    if (allergy.trim() === "") return;

    try {
      const res = await fetch("http://localhost:5000/api/user/allergens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: [allergy] }),
      });

      const data = await res.json();

      if (res.ok) {
        setAllergyList(data.allergens);
        setAllergy("");
      } else {
        alert(data.message || "Failed to add allergen");
      }
    } catch (error) {
      console.error("Error adding allergen:", error);
    }
  };

  // Delete an allergen
  const handleDeleteAllergy = async (item) => {
    try {
      const res = await fetch("http://localhost:5000/api/user/allergens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: [item] }),
      });

      const data = await res.json();

      if (res.ok) {
        setAllergyList(data.allergens);
      } else {
        alert(data.message || "Failed to delete allergen");
      }
    } catch (error) {
      console.error("Error deleting allergen:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Your Allergies</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter an allergy"
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
          className="border border-gray-400 rounded p-2 w-full"
        />
        <button
          onClick={handleAddAllergy}
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : allergyList.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {allergyList.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-800"
            >
              {item}
              <button
                onClick={() => handleDeleteAllergy(item)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No allergies added yet.</p>
      )}
    </div>
  );
};

export default Allergies;
