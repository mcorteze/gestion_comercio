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
import { useNavigate } from 'react-router-dom';
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
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

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
    fetchClientesProveedores();
  }, []);

  const handleFormError = (errorInfo) => {
    const errorField = errorInfo.errorFields?.[0];
    if (errorField) {
      const fieldName = errorField.name[0];
      const tabMap = {
        // Tab 1
        numero_orden_compra: '1',
        carpeta_onedrive: '1',
        numero_doc_solicitud: '1',
        numero_factura_proveedor: '1',

        // Tab 2
        cliente_id: '1',
        proveedor_id: '1',
        f_envio_soc: '1',
        incoterm: '1',
        moneda: '1',
        calidad: '1',

        // Tab 3    
        tipo_transporte: '2',
        numero_bl_awb_crt: '2',
        puerto_embarque: '2',
        puerto_destino: '2',
        f_etd: '2',
        f_eta: '2',
        f_envio_dctos_intercomex: '2',
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
        <h1>Crear Operación</h1>
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
              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
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
