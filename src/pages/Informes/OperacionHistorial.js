// Nuevo componente sin modal
import React, { useEffect, useState } from 'react';
import { Table, Spin, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';

const OperacionHistorial = ({ operacionId }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aliasMap, setAliasMap] = useState({});

  useEffect(() => {
    if (!operacionId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const [historialRes, aliasRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/operacion_historial/${operacionId}`),
          axios.get(`http://localhost:3001/api/alias-campos/tabla/operaciones`),
        ]);

        setHistorial(historialRes.data);

        const aliasObj = {};
        aliasRes.data.forEach(item => {
          aliasObj[item.nombre_campo] = item.alias;
        });
        setAliasMap(aliasObj);
      } catch (error) {
        console.error('Error al obtener historial o alias', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [operacionId]);

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'f_cambio',
      render: (f) => moment(f).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Operación',
      dataIndex: 'operacion',
    },
    {
      title: 'Campo',
      dataIndex: 'campo_modificado',
      render: (campo) => aliasMap[campo] || campo,
    },
    {
      title: 'Antes',
      dataIndex: 'valor_anterior',
    },
    {
      title: 'Después',
      dataIndex: 'valor_nuevo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
    },
  ];

  return loading ? <Spin /> : (
    <Table
      dataSource={historial}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
    />
  );
};

export default OperacionHistorial;
