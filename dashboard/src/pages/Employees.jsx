import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', code: '', password: '' });
  const [editId, setEditId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true };

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

  const loadEmployees = () => {
    fetchWithAuth('http://localhost:4000/api/users/employees')
      .then(res => res.json())
      .then(data => setEmployees(
        data.map(e => ({
          ...e,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onView: handleView
        }))
      ))
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleEdit = (employee) => {
    setForm({
      username: employee.username,
      email: employee.email,
      code: employee.code,
      password: '',
      error: '',
      success: '',
    });
    setEditId(employee.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet employé ?')) {
      fetchWithAuth(`http://localhost:4000/api/users/employees/${id}`, { method: 'DELETE' })
        .then(async res => {
          if (!res.ok) {
            const data = await res.json();
            setForm(f => ({ ...f, error: data.error || 'Erreur lors de la suppression', success: '' }));
          } else {
            setForm(f => ({ ...f, error: '', success: 'Employé supprimé avec succès' }));
            loadEmployees();
          }
        })
        .catch(() => setForm(f => ({ ...f, error: 'Erreur réseau', success: '' })));
    }
  };

  const handleView = (employee) => {
    setViewEmployee(employee);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, error: '', success: '' }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (editId) {
      response = await fetchWithAuth(`http://localhost:4000/api/users/employees/${editId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form }),
      });
    } else {
      response = await fetchWithAuth('http://localhost:4000/api/users/employees', {
        method: 'POST',
        body: JSON.stringify({ ...form, role: 'employe' }),
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
    loadEmployees();
  };

  const employeesGrid = [
    { field: 'username', headerText: 'Nom', width: '150', textAlign: 'Center' },
    { field: 'email', headerText: 'Email', width: '200', textAlign: 'Center' },
    { field: 'code', headerText: 'Code', width: '120', textAlign: 'Center' },
    { field: 'role', headerText: 'Rôle', width: '100', textAlign: 'Center', template: (props) => props.role === 'employe' ? 'Employé' : props.role },
    {
      headerText: 'Actions',
      width: '180',
      textAlign: 'Center',
      template: (props) => (
        <div>
          <button onClick={() => props.onView(props)} style={{ marginRight: 8, color: 'green', background: 'none', border: 'none', cursor: 'pointer' }}>👁️</button>
          <button onClick={() => props.onEdit(props)} style={{ marginRight: 8, color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
          <button onClick={() => props.onDelete(props.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />
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
            <h2 className="text-xl font-bold mb-4">{editId ? "Éditer un employé" : "Ajouter un employé"}</h2>
            <input className="border p-2 mb-2 w-full" name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleFormChange} required />
            <input className="border p-2 mb-2 w-full" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} required />
            <input className="border p-2 mb-2 w-full" name="code" placeholder="Code employé" value={form.code} onChange={handleFormChange} required />
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
      {viewEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Détails de l'employé</h2>
            <p><b>Nom :</b> {viewEmployee.username}</p>
            <p><b>Email :</b> {viewEmployee.email}</p>
            <p><b>Code :</b> {viewEmployee.code}</p>
            <p><b>Rôle :</b> {viewEmployee.role === 'employe' ? 'Employé' : viewEmployee.role}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setViewEmployee(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
      <GridComponent
        dataSource={employees}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {employeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page]} />
      </GridComponent>
      {/* Debug : afficher le token JWT courant */}
      {/* <pre style={{background:'#e8f7ff', color:'#0a3d62', fontSize:12, marginTop:8, padding:8, borderRadius:6}}>
        Token localStorage : {localStorage.getItem('token') || 'Aucun token'}
      </pre> */}
    </div>
  );
};

export default Employees;