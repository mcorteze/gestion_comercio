import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Select,
  DatePicker,
  ConfigProvider,
  Tabs,
} from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import esES from 'antd/locale/es_ES';
import CamposAdministrativos from '../../components/OperacionesCrearPage/CamposAdministrativos';
import CamposComerciales from '../../components/OperacionesCrearPage/CamposComerciales';
import CamposLogistica from '../../components/OperacionesCrearPage/CamposLogistica';

const { Option } = Select;
const { TabPane } = Tabs;

const OperacionesCrearPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ capturar el id si viene en la ruta

  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientesProveedores = async () => {
      try {
        const [clientesResponse, proveedoresResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/clientes'),
          axios.get('http://localhost:3001/api/proveedores'),
        ]);
        setClientes(clientesResponse.data);
        setProveedores(proveedoresResponse.data);
      } catch {
        notification.error({ message: 'Error al cargar clientes o proveedores' });
      }
    };

    const fetchOperacion = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/operaciones/${id}`);
        const data = response.data;

        // Formatear fechas para que sean compatibles con DatePicker
        const valoresFormateados = {
          ...data,
          f_etd: data.f_etd ? dayjs(data.f_etd) : null,
          f_eta: data.f_eta ? dayjs(data.f_eta) : null,
          f_envio_soc: data.f_envio_soc ? dayjs(data.f_envio_soc) : null,
          f_envio_dctos_intercomex: data.f_envio_dctos_intercomex ? dayjs(data.f_envio_dctos_intercomex) : null,
          f_pago_proveedor: data.f_pago_proveedor ? dayjs(data.f_pago_proveedor) : null,
          f_pago_derechos: data.f_pago_derechos ? dayjs(data.f_pago_derechos) : null,
        };

        form.setFieldsValue(valoresFormateados);
        notification.info({
          message: `Precargada operación #${id}`,
          description: 'Puede editar los campos antes de guardar.',
        });
      } catch (error) {
        notification.error({ message: 'Error al precargar la operación' });
      } finally {
        setLoading(false);
      }
    };

    fetchClientesProveedores();
    fetchOperacion();
  }, [id, form]);

  const handleFormError = (errorInfo) => {
    const errorField = errorInfo.errorFields?.[0];
    if (errorField) {
      const fieldName = errorField.name[0];
      const tabMap = {
        numero_orden_compra: '1',
        carpeta_onedrive: '1',
        numero_doc_solicitud: '1',
        numero_factura_proveedor: '1',
        cliente_id: '1',
        proveedor_id: '1',
        f_envio_soc: '1',
        incoterm: '1',
        moneda: '1',
        calidad: '1',
        tipo_transporte: '2',
        numero_bl_awb_crt: '2',
        puerto_embarque: '2',
        puerto_destino: '2',
        f_etd: '2',
        f_eta: '2',
        f_envio_dctos_intercomex: '2',
        tipo_transporte: '3',
        f_pago_proveedor: '3',
        f_pago_derechos: '3',
        dias_libres: '3',
        condicion_pago_dias: '3',
        comentarios: '1',
        estado: '1',
      };
      setActiveTab(tabMap[fieldName] || '1');
    }
  };

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:3001/api/operaciones', values);
      notification.success({ message: 'Operación creada correctamente' });
      navigate('/operaciones');
    } catch (err) {
      notification.error({ message: 'Error al crear la operación' });
    }
  };

  return (
    <ConfigProvider locale={esES}>
      <div className="page-full">
        <h1>{id ? 'Crear operación desde plantilla' : 'Crear Operación'}</h1>

        <div className="page-form-medio">
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={handleFormError}
            layout="vertical"
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Información Administrativa" key="1">
                <CamposAdministrativos clientes={clientes} proveedores={proveedores} />
              </TabPane>

              <TabPane tab="Detalles Comerciales" key="2">
                <CamposComerciales clientes={clientes} proveedores={proveedores} />
              </TabPane>

              <TabPane tab="Logística" key="3">
                <CamposLogistica clientes={clientes} proveedores={proveedores} />
              </TabPane>
            </Tabs>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: '10px' }}
                loading={loading}
              >
                Crear operación
              </Button>
              <Button
                danger
                onClick={() => {
                  const confirm = window.confirm('¿Está seguro de que desea cancelar?');
                  if (confirm) navigate('/operaciones');
                }}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OperacionesCrearPage;
