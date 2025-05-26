import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Spin, Tooltip, Tabs,Button } from 'antd';
import { MessageOutlined, HistoryOutlined  } from '@ant-design/icons';
import { LuBox } from "react-icons/lu";
import { useParams } from 'react-router-dom';
import { GrMoney } from "react-icons/gr";
import { MdDateRange } from "react-icons/md";
import moment from 'moment';

import LogisticaComentarios from '../../components/Logistica/LogisticaComentarios';
import LogisticaIdentificacionSimple from '../../components/Logistica/LogisticaIdentificacionSimple';
import LogisticaProductos from '../../components/Logistica/LogisticaProductos';
import OperacionStepper from '../../components/Bandeja/OperacionStepper';

import LogisticaEt from '../../components/Logistica/LogisticaEt';
import LogisticaPagos from '../../components/Logistica/LogisticaPagos';
import OperacionHistorial from '../Informes/OperacionHistorial';

import './LogisticaEditarPage.css';

const { TabPane } = Tabs;

const LogisticaEditarPage = ({ id: propId }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comentariosCount, setComentariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);

  const [historialVisible, setHistorialVisible] = useState(false);

  useEffect(() => {
    if (!id) return;

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

  useEffect(() => {
    if (!id) return;

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
  if (!id) return <div>ID de operación no especificado</div>;

  return (
    <div className="page-full" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1>Logística de Operación #{id}</h1>
      <div>
        <OperacionStepper operacionId={id} />
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div
          className="logistica-editar-form"
          style={{ flex: '0 0 350px', maxWidth: '350px' }}
        >
          <LogisticaIdentificacionSimple
            form={form}
            onFinish={handleSubmit}
            renderLabel={renderLabel}
          />
        </div>

        <div style={{ flex: 1, border: '1px solid #e0e0e0', backgroundColor: '#ffffff', padding: '8px 12px' }}>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <MdDateRange style={{ marginRight: 8 }} />
                  ET
                </span>
              }
              key="1"
            >
              <LogisticaEt operacionId={id} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <GrMoney style={{ marginRight: 8 }} />
                  Pagos
                </span>
              }
              key="2"
            >
              <LogisticaPagos operacionId={id} />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <LuBox style={{ marginRight: 8 }} />
                  Productos ({productosCount})
                </span>
              }
              key="3"
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
              key="4"
            >
              <LogisticaComentarios operacionId={id} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HistoryOutlined style={{ marginRight: 8 }} />
                  Historial
                </span>
              }
              key="5"
            >
              <OperacionHistorial operacionId={id} />
            </TabPane>


          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LogisticaEditarPage;
