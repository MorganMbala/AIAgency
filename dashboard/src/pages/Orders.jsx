import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import axios from 'axios';

import { contextMenuItems, ordersGrid } from '../data/dummy';
import { Header } from '../components';

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProgress(0);
    // Simule une progression (car axios ne donne pas le download progress sur les requêtes GET par défaut)
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 120);
    axios.get('http://localhost:8000/api/orders/all')
      .then(res => {
        if (isMounted) {
          setOrdersData(res.data);
          setProgress(100);
          setTimeout(() => { setLoading(false); }, 300);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOrdersData([]);
          setProgress(100);
          setTimeout(() => { setLoading(false); }, 300);
        }
      });
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: 320, margin: '0 auto 16px auto', background: '#eee', borderRadius: 8, height: 16, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#22C55E', transition: 'width 0.2s' }}></div>
            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#222', fontWeight: 500, fontSize: 14 }}>{progress}%</span>
          </div>
          <div style={{ color: '#888', fontSize: '16px' }}>Chargement des commandes...</div>
        </div>
      ) : (
        <GridComponent
          id="gridcomp"
          dataSource={ordersData}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          editSettings={editing}
        >
          <ColumnsDirective>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
        </GridComponent>
      )}
    </div>
  );
};
export default Orders;
