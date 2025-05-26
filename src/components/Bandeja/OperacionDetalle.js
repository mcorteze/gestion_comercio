import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Spin, Tooltip, Tabs, Modal } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { FaBarcode } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { TbBrowserMaximize } from "react-icons/tb";
import { LuHistory } from "react-icons/lu";
import moment from 'moment';
import LogisticaComentarios from './OperacionDetalleComentarios';
import LogisticaProductos from '../Logistica/LogisticaProductos';
import LogisticaCampos from './OperacionDetalleCampos';
import LogisticaEditarPage from '../../pages/Logistica/LogisticaEditarPage';
import OperacionHistorial from '../../pages/Informes/OperacionHistorial';
import './OperacionDetalle.css';

const OperacionDetalle = ({ operacionId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comentariosCount, setComentariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [historialVisible, setHistorialVisible] = useState(false);

  useEffect(() => {
    if (!operacionId) return;

    const fetchOperacion = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/operaciones/${operacionId}`);
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
  }, [operacionId, form]);

  useEffect(() => {
    if (!operacionId) return;

    const fetchCounts = async () => {
      try {
        const [comentariosRes, productosRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/operaciones/${operacionId}/comentarios/count`),
          axios.get(`http://localhost:3001/api/operaciones/${operacionId}/productos/count`),
        ]);

        setComentariosCount(comentariosRes.data.count);
        setProductosCount(productosRes.data.count);
      } catch (error) {
        console.error('Error al obtener conteos de productos/comentarios', error);
      }
    };

    fetchCounts();
  }, [operacionId]);

  const renderLabel = (text) => (
    <Tooltip title={text}>
      <span className="form-label-ellipsis">{text}</span>
    </Tooltip>
  );

  const handleSubmit = async (values) => {
    console.log('Valores enviados:', values);
  };

  if (!operacionId) return null;
  if (loading) return <Spin />;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-full logistica-editar-form bandeja-detalles">
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <div style={{ display: 'flex', gap: 12 }}>
            <Tooltip title="Ver historial de cambios">
              <LuHistory
                size={16}
                style={{ cursor: 'pointer', color: '#52c41a' }}
                onClick={() => setHistorialVisible(true)}
              />
            </Tooltip>
            <Tooltip title="Maximizar">
              <TbBrowserMaximize
                style={{ fontSize: 16, cursor: 'pointer', color: '#1677ff' }}
                onClick={() => setModalVisible(true)}
              />
            </Tooltip>
          </div>
        }
        items={[
          {
            key: '1',
            label: 'Ident',
            icon: <FaBarcode />,
            children: (
              <LogisticaCampos
                form={form}
                onFinish={handleSubmit}
                renderLabel={renderLabel}
              />
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <LuBox style={{ marginRight: 8 }} />
                Cargas ({productosCount})
              </span>
            ),
            children: <LogisticaProductos operacionId={operacionId} />,
          },
          {
            key: '3',
            label: (
              <span>
                <MessageOutlined style={{ marginRight: 8 }} />
                Comentarios ({comentariosCount})
              </span>
            ),
            children: <LogisticaComentarios operacionId={operacionId} />,
          },
        ]}
      />

      <Modal
        open={historialVisible}
        onCancel={() => setHistorialVisible(false)}
        footer={null}
        width="fit-content"
        style={{ top: 40 }}
        destroyOnClose
      >
        <OperacionHistorial operacionId={operacionId} />
      </Modal>


      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        <LogisticaEditarPage id={operacionId} />
      </Modal>
    </div>
  );
};

export default OperacionDetalle;
