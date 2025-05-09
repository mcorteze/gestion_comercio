import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Spin,
  Row,
  Col,
  Tooltip,
} from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import LogisticaComentarios from '../../components/Logistica/LogisticaComentarios';
import './LogisticaEditarPage.css';

const LogisticaEditarPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {/* Primera columna (formulario) */}
      <div className="page-full logistica-editar-form" style={{ flex: '0 0 350px', maxWidth: '350px' }}>
        <h1>Editar Logística de Operación #{id}</h1>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          
          {/* Campo ID solo en la primera fila */}
          <Form.Item name="id" label={renderLabel('ID')} style = {{ width: '100px' }} >
            <Input disabled />
          </Form.Item>

          {/* Resto del formulario en filas de dos columnas */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tipo_transporte" label={renderLabel('Tipo Transporte')}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numero_bl_awb_crt" label={renderLabel('Número BL/AWB/CRT')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="puerto_embarque" label={renderLabel('Puerto Embarque')}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="puerto_destino" label={renderLabel('Puerto Destino')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="f_etd" label={renderLabel('Fecha ETD')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="f_eta" label={renderLabel('Fecha ETA')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="f_envio_dctos_intercomex" label={renderLabel('Fecha Envío Dctos Intercomex')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="f_pago_proveedor" label={renderLabel('Fecha Pago Proveedor')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="f_pago_derechos" label={renderLabel('Fecha Pago Derechos')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dias_libres" label={renderLabel('Días Libres')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="condicion_pago_dias" label={renderLabel('Condición Pago Días')}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Segunda columna (comentarios) */}
      <div style={{ flex: 1 }}>
        <LogisticaComentarios operacionId={id} />
      </div>
    </div>
  );
};

export default LogisticaEditarPage;
