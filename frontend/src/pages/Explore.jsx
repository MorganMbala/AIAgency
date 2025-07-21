import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5002/api/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // Regroupe les produits filtrés par catégorie
  const filtered = !search ? products : products.filter(
    p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = filtered.reduce((acc, prod) => {
    const cat = prod.category || "Autres";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 2000);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    try {
      await axios.post('http://localhost:5003/api/cart/add', { productId: product._id || product.id, quantity: 1 }, { withCredentials: true });
      // Optionnel : afficher une notification/toast
    } catch (err) {
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const handleLogin = async (credentials) => {
    setLoginError(null);
    setLoginSuccess(false);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', credentials, { withCredentials: true });
      if (res.data && res.data.token) {
        setLoginSuccess(true);
        // Redirection ou autre logique après succès
      } else {
        setLoginError('Connexion échouée.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-32 px-4">
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center border-b border-black w-80">
            <FiSearch className="text-xl mr-2" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full py-2 outline-none bg-transparent text-lg font-light"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-8">Explorez nos produits</h1>
        {Object.keys(grouped).map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 uppercase tracking-widest text-gray-700">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {grouped[category].map(product => (
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
        ))}
        {loginError && <div className="text-red-500 text-center mt-4">{loginError}</div>}
        {loginSuccess && <div className="text-green-500 text-center mt-4">Connexion réussie !</div>}
        {showLoginMessage && (
          <div className="fixed bottom-24 right-8 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
            Pour ajouter au panier, vous devez vous connecter.
          </div>
        )}
      </div>
      {/* Icône de chat flottante en bas à droite */}
      <button
        className="fixed bottom-8 right-8 bg-white border border-gray-300 rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-100 z-50"
        title="Chat"
        // onClick={} // Ajoute ici l'action pour ouvrir le chat si besoin
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-black">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0 4.556 4.694 8.25 9.75 8.25.978 0 1.927-.12 2.825-.344.37-.09.764-.02 1.06.217l2.122 1.697a.75.75 0 0 0 1.207-.6v-2.07c0-.414.336-.75.75-.75 1.443-1.35 2.286-3.01 2.286-4.9 0-4.556-4.694-8.25-9.75-8.25S2.25 7.444 2.25 12Z" />
        </svg>
      </button>
    </>
  );
};

export default Explore;
