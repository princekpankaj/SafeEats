import React, { useState, useEffect } from "react";

const Allergies = () => {
  const [allergy, setAllergy] = useState("");
  const [allergyList, setAllergyList] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("loggedInEmail");
    const userData = JSON.parse(localStorage.getItem("user")) || [];
    const currentUser = userData.find((user) => user.email === email);

    if (currentUser?.allergies) {
      setAllergyList(currentUser.allergies);
    }
  }, []);

  const handleAddAllergy = () => {
    if (allergy.trim() === "") return;

    const updatedList = [...allergyList, allergy];
    setAllergyList(updatedList);
    setAllergy("");

    const email = localStorage.getItem("loggedInEmail");
    const allUsers = JSON.parse(localStorage.getItem("user")) || [];

    const updatedUsers = allUsers.map((user) => {
      if (user.email === email) {
        return { ...user, allergies: updatedList };
      }
      return user;
    });

    localStorage.setItem("user", JSON.stringify(updatedUsers));
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
      {allergyList.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {allergyList.map((item, index) => (
            <li key={index} className="text-gray-800">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No allergies added yet.</p>
      )}
    </div>
  );
};

export default Allergies;
