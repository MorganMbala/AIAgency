import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Explore = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5002/api/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const handleAddToCart = (product) => {
    // À adapter selon ta logique panier
    alert(`Produit ajouté au panier : ${product.name}`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 px-4">
        <h1 className="text-3xl font-bold mb-8">Explorez nos produits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id || product._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="text-lg font-bold mb-4">{product.price} $</div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleAddToCart(product)}
              >
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
