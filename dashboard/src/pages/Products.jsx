// ...imports existants...
import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Page, Search, Toolbar } from '@syncfusion/ej2-react-grids';

const initialForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  available: true,
  options: [],
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null); // Pour savoir si on édite ou ajoute
  const [showDetails, setShowDetails] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5002/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Edition (PUT)
      fetch(`http://localhost:5002/api/products/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then((updated) => {
          setProducts((prev) => prev.map(p => p._id === editId ? updated : p));
          setShowForm(false);
          setForm(initialForm);
          setEditId(null);
        });
    } else {
      // Ajout (POST)
      fetch('http://localhost:5002/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then((newProduct) => {
          setProducts((prev) => [...prev, newProduct]);
          setShowForm(false);
          setForm(initialForm);
        });
    }
  };

  // Suppression avec confirmation
  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    fetch(`http://localhost:5002/api/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(prev => prev.filter(p => p._id !== id)));
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
    setShowForm(true);
  };

  const handleShowDetails = (product) => {
    setDetailsProduct(product);
    setShowDetails(true);
  };

  // Gestion dynamique des options dans le formulaire
  const handleOptionChange = (idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const options = [...prev.options];
      options[idx][name] = value;
      return { ...prev, options };
    });
  };

  const handleAddOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { name: '', choices: [] }],
    }));
  };

  const handleRemoveOption = (idx) => {
    setForm((prev) => {
      const options = prev.options.filter((_, i) => i !== idx);
      return { ...prev, options };
    });
  };

  // Gestion des choix pour chaque option
  const handleChoiceChange = (optIdx, choiceIdx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const options = [...prev.options];
      const choices = [...options[optIdx].choices];
      choices[choiceIdx][name] = value;
      options[optIdx].choices = choices;
      return { ...prev, options };
    });
  };

  const handleAddChoice = (optIdx) => {
    setForm((prev) => {
      const options = [...prev.options];
      options[optIdx].choices = [...(options[optIdx].choices || []), { label: '', price: '' }];
      return { ...prev, options };
    });
  };

  const handleRemoveChoice = (optIdx, choiceIdx) => {
    setForm((prev) => {
      const options = [...prev.options];
      options[optIdx].choices = options[optIdx].choices.filter((_, i) => i !== choiceIdx);
      return { ...prev, options };
    });
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <p className="text-gray-400 text-md mb-1">Page</p>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowForm(true)}
      >
        + Ajouter un produit
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-4">{editId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
            <input className="border p-2 mb-2 w-full" name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
            <input className="border p-2 mb-2 w-full" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input className="border p-2 mb-2 w-full" name="price" type="number" placeholder="Prix" value={form.price} onChange={handleChange} required />
            <input className="border p-2 mb-2 w-full" name="image" placeholder="URL image" value={form.image} onChange={handleChange} />
            <input className="border p-2 mb-2 w-full" name="category" placeholder="Catégorie" value={form.category} onChange={handleChange} />
            <label className="block mb-2">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
              Disponible
            </label>
            {/* Gestion avancée des options */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Options personnalisables</span>
                <button type="button" className="ml-2 px-2 py-1 bg-green-500 text-white rounded" onClick={handleAddOption}>+ Option</button>
              </div>
              {form.options.map((opt, optIdx) => (
                <div key={optIdx} className="border p-2 mb-2 rounded bg-gray-50">
                  <div className="flex items-center mb-1">
                    <input className="border p-1 mr-2 flex-1" name="name" placeholder="Nom de l'option (ex: Technologie)" value={opt.name} onChange={e => handleOptionChange(optIdx, e)} />
                    <button type="button" className="ml-2 px-2 py-1 bg-red-400 text-white rounded" onClick={() => handleRemoveOption(optIdx)}>Supprimer</button>
                  </div>
                  <div className="ml-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Choix</span>
                      <button type="button" className="ml-2 px-2 py-1 bg-blue-400 text-white rounded" onClick={() => handleAddChoice(optIdx)}>+ Choix</button>
                    </div>
                    {opt.choices && opt.choices.map((choice, choiceIdx) => (
                      <div key={choiceIdx} className="flex items-center mb-1">
                        <input className="border p-1 mr-2" name="label" placeholder="Label (ex: React)" value={choice.label} onChange={e => handleChoiceChange(optIdx, choiceIdx, e)} />
                        <input className="border p-1 mr-2 w-20" name="price" type="number" placeholder="Prix" value={choice.price} onChange={e => handleChoiceChange(optIdx, choiceIdx, e)} />
                        <button type="button" className="px-2 py-1 bg-red-300 text-white rounded" onClick={() => handleRemoveChoice(optIdx, choiceIdx)}>X</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => { setShowForm(false); setForm(initialForm); setEditId(null); }}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editId ? 'Enregistrer' : 'Ajouter'}</button>
            </div>
          </form>
        </div>
      )}

      <GridComponent
        dataSource={products}
        allowPaging
        pageSettings={{ pageSize: 10 }}
        toolbar={['Search']}
        allowSorting
      >
        <ColumnsDirective>
          <ColumnDirective field="name" headerText="Nom" width="150" textAlign="Center" />
          <ColumnDirective field="description" headerText="Description" width="200" textAlign="Center" />
          <ColumnDirective field="price" headerText="Prix ($)" width="100" textAlign="Center" />
          <ColumnDirective field="category" headerText="Catégorie" width="120" textAlign="Center" />
          <ColumnDirective field="available" headerText="Disponible" width="100" textAlign="Center"
            template={(props) => props.available ? 'Oui' : 'Non'} />
          <ColumnDirective field="image" headerText="Image" width="120" textAlign="Center"
            template={(props) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <img src={props.image} alt={props.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px #0001' }} />
              </div>
            )} />
          <ColumnDirective field="options" headerText="Options" width="200" textAlign="Center"
            template={(props) => (
              <ul style={{ fontSize: 12 }}>
                {props.options?.map(opt => (
                  <li key={opt.name}>
                    <b>{opt.name}</b>: {opt.choices?.map(c => `${c.label} (+${c.price}$)`).join(', ')}
                  </li>
                ))}
              </ul>
            )} />
          <ColumnDirective
            headerText="Actions"
            width="160"
            textAlign="Center"
            template={(props) => (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button onClick={() => handleShowDetails(props)} title="Voir les détails" style={{ color: 'black' }}>👁️</button>
                <button onClick={() => handleEdit(props)} title="Éditer" style={{ color: 'blue' }}>✏️</button>
                <button onClick={() => handleDelete(props._id)} title="Supprimer" style={{ color: 'red' }}>🗑️</button>
              </div>
            )}
          />
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>

      {/* Modale détails produit */}
      {showDetails && detailsProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowDetails(false)}>×</button>
            <h2 className="text-2xl font-bold mb-2">{detailsProduct.name}</h2>
            <img src={detailsProduct.image} alt={detailsProduct.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            <div className="mb-2"><b>Description :</b> {detailsProduct.description}</div>
            <div className="mb-2"><b>Prix :</b> {detailsProduct.price}$</div>
            <div className="mb-2"><b>Catégorie :</b> {detailsProduct.category}</div>
            <div className="mb-2"><b>Disponible :</b> {detailsProduct.available ? 'Oui' : 'Non'}</div>
            {detailsProduct.options && detailsProduct.options.length > 0 && (
              <div className="mb-2">
                <b>Options :</b>
                <ul className="ml-4 list-disc">
                  {detailsProduct.options.map(opt => (
                    <li key={opt.name}>
                      <b>{opt.name}</b> : {opt.choices?.map(c => `${c.label} (+${c.price}$)`).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;