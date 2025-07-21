import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/orders/history', { withCredentials: true })
      .then(res => {
        setOrders(res.data);
        setError(null);
      })
      .catch(() => {
        setOrders([]);
        setError('Erreur lors du chargement des commandes');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Historique des commandes</h2>
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">Aucune commande passée.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Commande #{order.id}</span>
              <span className="text-gray-500">{order.date}</span>
              <span className="font-bold text-cyan-600">C${order.total}</span>
              {order.invoice_url && (
                <a href={order.invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Facture PDF</a>
              )}
            </div>
            <ul className="mt-2 text-sm text-gray-700">
              {order.items.map(item => (
                <li key={item.productId} className="flex items-center gap-3 py-1">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-gray-400">IMG</span>
                    )}
                  </div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-500">x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
