import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Spin, Tooltip, Tabs } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { LuBox } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import moment from 'moment';
import LogisticaComentarios from '../../components/Logistica/LogisticaComentarios';
import LogisticaCampos from '../../components/Logistica/LogisticaCampos';
import LogisticaProductos from '../../components/Logistica/LogisticaProductos';
import './LogisticaEditarPage.css';

const { TabPane } = Tabs;

const LogisticaEditarPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comentariosCount, setComentariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);

  // Fetch operación
  useEffect(() => {
    const fetchOperacion = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/operaciones/${id}`);
        const data = response.data;

        const dateFields = [
          'f_etd',
          'f_eta',
          'f_envio_dctos_intercomex',
          'f_pago_proveedor',
          'f_pago_derechos',
        ];
        dateFields.forEach(field => {
          if (data[field]) data[field] = moment(data[field]);
        });

        form.setFieldsValue(data);
      } catch (err) {
        setError('Error al obtener la operación');
      } finally {
        setLoading(false);
      }
    };

    fetchOperacion();
  }, [id, form]);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [comentariosRes, productosRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/operaciones/${id}/comentarios/count`),
          axios.get(`http://localhost:3001/api/operaciones/${id}/productos/count`),
        ]);

        setComentariosCount(comentariosRes.data.count);
        setProductosCount(productosRes.data.count);
      } catch (error) {
        console.error('Error al obtener conteos de productos/comentarios', error);
      }
    };

    fetchCounts();
  }, [id]);

  const renderLabel = (text) => (
    <Tooltip title={text}>
      <span className="form-label-ellipsis">{text}</span>
    </Tooltip>
  );

  const handleSubmit = async (values) => {
    console.log('Valores enviados:', values);
  };

  if (loading) return <Spin />;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div className="page-full logistica-editar-form" style={{ flex: '0 0 350px', maxWidth: '350px' }}>
        <h1>Editar Logística de Operación #{id}</h1>
        <LogisticaCampos form={form} onFinish={handleSubmit} renderLabel={renderLabel} />
      </div>

      <div style={{ flex: 1 }}>
        <Tabs defaultActiveKey="1">
  <TabPane
    tab={
      <span>
        <LuBox style={{ marginRight: 8 }} />
        Productos ({productosCount})
      </span>
    }
    key="1"
  >
    <LogisticaProductos operacionId={id} />
  </TabPane>
  <TabPane
    tab={
      <span>
        <MessageOutlined style={{ marginRight: 8 }} />
        Comentarios ({comentariosCount})
      </span>
    }
    key="2"
  >
    <LogisticaComentarios operacionId={id} />
  </TabPane>
</Tabs>
      </div>
    </div>
  );
};

export default LogisticaEditarPage;
