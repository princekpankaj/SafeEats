import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Scanner = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [safetyStatus, setSafetyStatus] = useState(null);
  const [productName, setProductName] = useState("");
  const [matchedAllergens, setMatchedAllergens] = useState([]);
  const [message, setMessage] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scannerContainerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);


  // set as global base url to fecth api
  const API_BASE = "http://localhost:5000";

  const handleRecipeImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setRecipeImage(base64Image);

        try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${API_BASE}/api/chatbot/recipe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ image: base64Image }),
          });

          const data = await res.json();
          if (res.ok) {
            setRecipeText(data.text);
          } else {
            setRecipeText("Failed to analyze recipe image.");
          }
        } catch (err) {
          console.error("Recipe OCR error:", err);
          setRecipeText("Something went wrong while analyzing recipe.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarcodeSubmit = async () => {
    if (!barcodeInput.trim()) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ barcode: barcodeInput }),
      });

      const data = await res.json();

      if (res.ok) {
        const { nutrition, isSafe, matchedAllergens, product_name, message } =
          data;
        setNutritionData(nutrition);
        setSafetyStatus(isSafe);
        setProductName(product_name);
        setMatchedAllergens(matchedAllergens);
        setMessage(message);
      } else {
        setError(data.message || "Failed to fetch scan result.");
      }
    } catch (error) {
      console.error("Scan error:", error);
      setError("Something went wrong while scanning.");
    }

    setLoading(false);
    setBarcodeInput("");
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current
        .stop()
        .then(() => {
          qrCodeScannerRef.current.clear();
          qrCodeScannerRef.current = null;
        })
        .catch((err) => console.error("Error stopping scanner", err));
    }
  };

  const startCameraScan = () => {
    if (!scannerContainerRef.current || !document.getElementById("scanner-container")) return;

    const html5QrCode = new Html5Qrcode("scanner-container");
    qrCodeScannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        setBarcodeInput(decodedText);
        html5QrCode
          .stop()
          .then(() => {
            html5QrCode.clear();
            qrCodeScannerRef.current = null;
            setShowModal(false);
          })
          .catch((err) => console.error("Stop error:", err));
      },
      (errorMessage) => {
        console.warn("Scan error:", errorMessage);
      }
    );
  };

  const handleBarcodeImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader-temp");
    try {
      const result = await html5QrCode.scanFile(file, true);
      setBarcodeInput(result);
      closeModal();
    } catch (err) {
      alert("Failed to scan barcode from image.");
      console.error(err);
    } finally {
      await html5QrCode.clear();
    }
  };

  useEffect(() => {
    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current
          .stop()
          .then(() => qrCodeScannerRef.current.clear())
          .catch((err) => console.error("Cleanup error", err));
      }
    };
  }, []);

  return (
    <div className="relative m-5">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Scan or Upload Barcode
            </h2>

            <div className="flex flex-col space-y-4 items-center">
              <button
                onClick={startCameraScan}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full"
              >
                Use Camera
              </button>
              <label className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full text-center cursor-pointer">
                Upload Barcode Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBarcodeImageUpload}
                />
              </label>
            </div>

            <div
              ref={scannerContainerRef}
              id="scanner-container"
              className="mt-6"
            ></div>
            <div id="reader-temp" className="hidden" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recipe Upload */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-camera text-3xl text-black mr-4"></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleRecipeImageUpload}
              className="hidden"
              id="recipeFileInput"
            />
            <label
              htmlFor="recipeFileInput"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-800"
            >
              Scan Recipe
            </label>
          </div>
          <div className="relative">
            {recipeImage && (
              <img
                src={recipeImage}
                alt="Recipe"
                className="absolute top-0 right-0 w-14 h-14 object-cover rounded-lg shadow-md m-0.5"
              />
            )}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Recipe Details:</h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {recipeText || "No recipe scanned yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Barcode Scanner */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-barcode text-3xl text-black mr-4"></i>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-800"
            >
              Scan Barcode
            </button>
          </div>

          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Or enter barcode manually"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={handleBarcodeSubmit}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Scanning..." : "Submit"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {nutritionData && (
            <div className="bg-gray-100 p-6 rounded-lg mt-6">
              <h3 className="font-semibold mb-2">Scan Results:</h3>
              <p className="mb-4 font-medium">{productName}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">{nutritionData.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">{nutritionData.proteins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-medium">{nutritionData.sugar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-medium">{nutritionData.fat}</span>
                </div>
                <div className="mt-3 text-sm text-gray-700">{message}</div>
                {matchedAllergens.length > 0 && (
                  <div className="mt-3 text-red-500 text-sm">
                    Allergens detected: {matchedAllergens.join(", ")}
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center">
                <i
                  className={`fas ${
                    safetyStatus
                      ? "fa-check-circle text-green-500"
                      : "fa-times-circle text-red-500"
                  } mr-2`}
                ></i>
                <span
                  className={`font-medium ${
                    safetyStatus ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {safetyStatus ? "Safe to eat" : "Not safe to eat"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
