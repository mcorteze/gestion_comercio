import React, { useEffect, useState } from 'react';
import { Select, Table, Input, Button, message, Typography } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

const AliasCamposEditar = () => {
  const [tablas, setTablas] = useState([]);
  const [tablaSeleccionada, setTablaSeleccionada] = useState(null);
  const [campos, setCampos] = useState([]);
  const [originalCampos, setOriginalCampos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener las tablas únicas de alias_campos
  useEffect(() => {
    axios.get('http://localhost:3001/api/alias-campos')
      .then(res => {
        const tablasUnicas = [...new Set(res.data.map(item => item.nombre_tabla))];
        setTablas(tablasUnicas);
      })
      .catch(err => {
        console.error(err);
        message.error('Error al cargar las tablas');
      });
  }, []);

  // Cargar los campos de la tabla seleccionada
    const fetchCampos = (nombreTabla) => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/alias-campos/tabla/${nombreTabla}`)
        .then(res => {
        const datosOrdenados = res.data.sort((a, b) => a.id - b.id); // <- ORDEN POR ID
        setCampos(datosOrdenados);
        setOriginalCampos(datosOrdenados);
        })
        .catch(err => {
        console.error(err);
        message.error('Error al cargar los campos');
        })
        .finally(() => setLoading(false));
    };


  const handleAliasChange = (id, newAlias) => {
    setCampos(prev =>
      prev.map(item => item.id === id ? { ...item, alias: newAlias } : item)
    );
  };

  const guardarCambios = async () => {
    const cambios = campos.filter((campo, idx) => campo.alias !== originalCampos[idx]?.alias);

    if (cambios.length === 0) {
      message.info('No hay cambios para guardar.');
      return;
    }

    try {
      await Promise.all(
        cambios.map(campo =>
          axios.put(`http://localhost:3001/api/alias-campos/${campo.id}`, { alias: campo.alias })
        )
      );
      message.success('Cambios guardados correctamente.');
      fetchCampos(tablaSeleccionada); // recargar los datos actualizados
    } catch (err) {
      console.error(err);
      message.error('Error al guardar los cambios.');
    }
  };

  const columns = [
    {
      title: 'Nombre Tabla',
      dataIndex: 'nombre_tabla',
      key: 'nombre_tabla',
    },
    {
      title: 'Nombre Campo',
      dataIndex: 'nombre_campo',
      key: 'nombre_campo',
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      key: 'alias',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleAliasChange(record.id, e.target.value)}
        />
      ),
    },
  ];

  return (
    <div className="page-full">
      <h1>Renombrar campos</h1>

      <Select
        placeholder="Seleccionar tabla"
        style={{ width: 300, marginBottom: 24 }}
        onChange={(value) => {
          setTablaSeleccionada(value);
          fetchCampos(value);
        }}
        value={tablaSeleccionada}
      >
        {tablas.map(tabla => (
          <Option key={tabla} value={tabla}>{tabla}</Option>
        ))}
      </Select>

      <Table
        dataSource={campos}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />

      <Button
        type="primary"
        onClick={guardarCambios}
        style={{ marginTop: 16 }}
        disabled={!tablaSeleccionada}
      >
        Guardar cambios
      </Button>
    </div>
  );
};

export default AliasCamposEditar;
