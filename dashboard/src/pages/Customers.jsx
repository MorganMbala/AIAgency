import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, Search } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', code: '', password: '' });
  const [editId, setEditId] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  // fetchWithAuth utilise credentials: 'include' pour envoyer le cookie JWT
  const fetchWithAuth = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  };

  // Récupération des clients depuis le backend
  const loadCustomers = () => {
    fetchWithAuth('http://localhost:4000/api/users/customers')
      .then(res => res.json())
      .then(data => setCustomers(
        data.map(c => ({
          ...c,
          username: c.username || c.name, // compatibilité si le champ s'appelle name
          id: c.id || c._id, // compatibilité clé primaire
          onEdit: handleEdit,
          onDelete: handleDelete,
        }))
      ))
      .catch(() => setCustomers([]));
  };

  useEffect(() => {
    // Vérifie si un token est passé dans l'URL (ex: /dashboard?token=...)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      // Optionnel: retirer le paramètre de l'URL pour éviter de le laisser visible
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    loadCustomers();
    // eslint-disable-next-line
  }, []);

  // Handlers pour actions
  const handleEdit = (customer) => {
    setForm({
      username: customer.username,
      email: customer.email,
      code: customer.code,
      password: '', // vide pour édition
      error: '',
      success: '',
    });
    setEditId(customer.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce client ?')) {
      fetchWithAuth(`http://localhost:4000/api/users/customers/${id}`, { method: 'DELETE' })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json();
            setForm(f => ({ ...f, error: data.error || 'Erreur lors de la suppression', success: '' }));
          } else {
            setForm(f => ({ ...f, error: '', success: 'Client supprimé avec succès' }));
            loadCustomers();
          }
        })
        .catch(() => setForm(f => ({ ...f, error: 'Erreur réseau', success: '' })));
    }
  };

  const handleView = (customer) => {
    setViewCustomer(customer);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, error: '', success: '' }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (editId) {
      // Edition
      response = await fetchWithAuth(`http://localhost:4000/api/users/customers/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form }),
      });
    } else {
      // Ajout
      response = await fetchWithAuth('http://localhost:4000/api/users/customers', {
        method: 'POST',
        body: JSON.stringify({ ...form }),
      });
    }
    if (response && !response.ok) {
      const data = await response.json();
      setForm(f => ({ ...f, error: data.error || 'Erreur lors de la sauvegarde', success: '' }));
      return;
    }
    setShowForm(false);
    setEditId(null);
    setForm({ username: '', email: '', code: '', password: '', error: '', success: '' });
    loadCustomers();
  };

  // Colonnes personnalisées avec actions
  const customersGrid = [
    { field: 'username', headerText: 'Nom', width: '150', textAlign: 'Center' },
    { field: 'email', headerText: 'Email', width: '200', textAlign: 'Center' },
    { field: 'code', headerText: 'Code', width: '120', textAlign: 'Center' },
    { field: 'role', headerText: 'Rôle', width: '100', textAlign: 'Center' },
    {
      headerText: 'Actions',
      width: '150',
      textAlign: 'Center',
      template: (props) => (
        <div>
          <button onClick={() => handleView(props)} style={{ marginRight: 8, color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}>👁️</button>
          <button onClick={() => props.onEdit(props)} style={{ marginRight: 8, color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
          <button onClick={() => props.onDelete(props.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
        </div>
      ),
    },
  ];
  const toolbarOptions = ['Search'];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => { setShowForm(true); setEditId(null); setForm({ username: '', email: '', code: '', password: '' }); }}
      >
        + Ajouter
      </button>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onSubmit={handleFormSubmit}
          >
            <h2 className="text-xl font-bold mb-4">{editId ? "Éditer un client" : "Ajouter un client"}</h2>
            <input className="border p-2 mb-2 w-full" name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleFormChange} required />
            <input className="border p-2 mb-2 w-full" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} required />
            <input className="border p-2 mb-2 w-full" name="code" placeholder="Code client" value={form.code} onChange={handleFormChange} required />
            <input className="border p-2 mb-2 w-full" name="password" type="password" placeholder={editId ? "Nouveau mot de passe (optionnel)" : "Mot de passe"} value={form.password} onChange={handleFormChange} required={!editId} />
            {/* Affichage des messages d'erreur/succès */}
            {form.error && (
              <div className="text-red-600 text-sm mb-2">{form.error}</div>
            )}
            {form.success && (
              <div className="text-green-600 text-sm mb-2">{form.success}</div>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editId ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </form>
        </div>
      )}
      {viewCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Détails du client</h2>
            <p><b>Nom :</b> {viewCustomer.username}</p>
            <p><b>Email :</b> {viewCustomer.email}</p>
            <p><b>Code :</b> {viewCustomer.code}</p>
            <p><b>Rôle :</b> {viewCustomer.role}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setViewCustomer(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
      <GridComponent
        dataSource={customers}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        allowSorting
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {customersGrid.map((col, idx) =>
            col.template ? (
              <ColumnDirective key={idx} {...col} template={col.template} />
            ) : (
              <ColumnDirective key={idx} {...col} />
            )
          )}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search]} />
      </GridComponent>
    </div>
  );
};

export default Customers;