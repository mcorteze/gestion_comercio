import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import OperacionesCambios from './OperacionesCambios.js'

const InformesPage = () => {
  return (
    <div className="page-full">
      <h1>Informes</h1>
        <h2>Listado de operaciones con cambios</h2>
        <OperacionesCambios />
    </div>
  );
};

export default InformesPage;
