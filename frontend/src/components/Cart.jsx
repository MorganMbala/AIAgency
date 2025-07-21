import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const Cart = ({ onClose }) => {
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  // Récupère les détails produits pour chaque item du panier
  const fetchProductDetails = async (productIds) => {
    if (!productIds.length) return [];
    const res = await axios.post('http://localhost:5002/api/products/bulk', { ids: productIds });
    return res.data; // [{ _id, name, image, price, description, ... }]
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5003/api/cart', { withCredentials: true });
      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data.cartItems)) {
        items = res.data.cartItems;
      } else if (Array.isArray(res.data.cart)) {
        items = res.data.cart;
      }
      // Enrichir les items avec les infos produits
      if (items.length > 0) {
        const productIds = items.map(i => i.productId);
        const products = await fetchProductDetails(productIds);
        items = items.map(item => ({
          ...item,
          ...products.find(p => p._id === item.productId)
        }));
      }
      setCartItems(items);
      setError(null);
      refreshCart(); // Synchronise le compteur global
    } catch (err) {
      setError('Erreur lors du chargement du panier');
    }
    setLoading(false);
  };

  const handleQuantity = async (productId, delta) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    try {
      await axios.post('http://localhost:5003/api/cart/add', { productId, quantity: delta }, { withCredentials: true });
      // Mise à jour locale sans rechargement complet
      setCartItems(prev => prev.map(i =>
        i.productId === productId ? { ...i, quantity: newQty } : i
      ));
      refreshCart(); // Synchronise le compteur global
    } catch (err) {
      setError('Erreur lors de la modification de la quantité');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.post('http://localhost:5003/api/cart/remove', { productId }, { withCredentials: true });
      // Mise à jour locale sans rechargement complet
      setCartItems(prev => prev.filter(i => i.productId !== productId));
      refreshCart(); // Synchronise le compteur global
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleClear = async () => {
    try {
      await axios.post('http://localhost:5003/api/cart/clear', {}, { withCredentials: true });
      fetchCart();
      refreshCart(); // Synchronise le compteur global
    } catch (err) {
      setError('Erreur lors du vidage du panier');
    }
  };

  // Ajout de la redirection vers StripeCheckout au clic sur Place Order
  const handlePlaceOrder = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  const subTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // LOG INTELLIGENT : Affiche le panier à chaque update
  useEffect(() => {
    console.log('Cart.jsx cartItems (à chaque update):', cartItems);
  }, [cartItems]);

  return (
    <div className="bg-half-transparent w-full fixed nav-item top-0 right-0 z-50">
      <div className="float-right h-screen duration-1000 ease-in-out bg-white md:w-[32rem] w-full max-w-2xl p-8 shadow-2xl overflow-y-auto relative">
        {/* Bouton pour fermer le panier (fermeture modale ou retour Explore) */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl z-10"
          onClick={onClose ? onClose : () => window.location.assign('/explore')}
          title="Fermer le panier"
        >
          <MdOutlineCancel />
        </button>
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold text-lg">Shopping Cart</p>
          {/* Bouton pour vider le panier */}
          <button onClick={handleClear} className="ml-2 px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 transition" title="Vider le panier">
            Vider
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10">Chargement...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : cartItems.length === 0 ? (
          <>
            <div className="text-center py-10 text-gray-400">Votre panier est vide.</div>
            <div className="mt-2 flex flex-col gap-3">
              <button
                className="w-full py-2 rounded-lg text-cyan-700 font-semibold border border-cyan-400 hover:bg-cyan-50"
                onClick={() => navigate('/order-history')}
              >
                Voir l'historique des commandes
              </button>
            </div>
          </>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-5 border-b py-4">
                {/* Afficher image et nom du produit */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    'IMG'
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name || `Produit ${item.productId}`}</p>
                  <p className="text-gray-500 text-xs mb-1">{item.description}</p>
                  <p className="text-gray-600 text-sm">x{item.quantity}</p>
                  <div className="flex gap-4 mt-2 items-center">
                    <p className="font-semibold text-lg">{item.price ? `$${item.price}` : '--'}</p>
                    <div className="flex items-center border rounded">
                      <button className="p-2 text-red-600" onClick={() => handleQuantity(item.productId, -1)}><AiOutlineMinus /></button>
                      <span className="px-3">{item.quantity}</span>
                      <button className="p-2 text-green-600" onClick={() => handleQuantity(item.productId, 1)}><AiOutlinePlus /></button>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 text-xl" onClick={() => handleRemove(item.productId)}><MdOutlineCancel /></button>
              </div>
            ))}
            <div className="mt-6 mb-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Sub Total</p>
                <p className="font-semibold">${subTotal}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500">Total</p>
                <p className="font-semibold">${subTotal}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <button
                className="w-full py-3 rounded-lg text-white font-semibold text-lg bg-cyan-400 hover:bg-cyan-500 transition"
                onClick={() => {
                  console.log('Panier transmis à StripeCheckout:', cartItems);
                  navigate('/stripe-checkout', { state: { cartItems } });
                }}
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
              <button
                className="w-full py-2 rounded-lg text-cyan-700 font-semibold border border-cyan-400 hover:bg-cyan-50"
                onClick={() => navigate('/order-history')}
              >
                Voir l'historique des commandes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
