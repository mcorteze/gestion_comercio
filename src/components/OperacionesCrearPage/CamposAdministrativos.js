import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CamposAdministrativos = ({ clientes, proveedores }) => {
  const [aliasMap, setAliasMap] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/alias-campos/tabla/operaciones')
      .then(res => {
        const aliases = {};
        res.data.forEach(({ nombre_campo, alias }) => {
          aliases[nombre_campo] = alias;
        });
        setAliasMap(aliases);
      })
      .catch(err => {
        console.error('Error al cargar alias:', err);
      });
  }, []);

  const getAlias = (campo) => aliasMap[campo] || campo;

  return (
    <>
      <Form.Item
        label={getAlias("numero_orden_compra")}
        name="numero_orden_compra"
        rules={[{ required: true, message: 'Ingrese el número de orden de compra' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getAlias("carpeta_onedrive")}
        name="carpeta_onedrive"
        rules={[{ required: true, message: 'Ingrese la carpeta OneDrive' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getAlias("numero_doc_solicitud")}
        name="numero_doc_solicitud"
        rules={[{ required: true, message: 'Ingrese el número de solicitud' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getAlias("numero_factura_proveedor")}
        name="numero_factura_proveedor"
        rules={[{ required: true, message: 'Ingrese el número de factura' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default CamposAdministrativos;
