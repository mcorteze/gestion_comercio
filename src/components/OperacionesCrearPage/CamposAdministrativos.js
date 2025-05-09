import { Form, Input, Select } from 'antd';

const { Option } = Select;

const CamposAdministrativos = ({ clientes, proveedores }) => (
  <>
    <Form.Item
      label="Número de Orden de Compra"
      name="numero_orden_compra"
      rules={[{ required: true, message: 'Ingrese el número de orden de compra' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Carpeta OneDrive"
      name="carpeta_onedrive"
      rules={[{ required: true, message: 'Ingrese la carpeta OneDrive' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Número de Documento de Solicitud"
      name="numero_doc_solicitud"
      rules={[{ required: true, message: 'Ingrese el número de solicitud' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Número de Factura Proveedor"
      name="numero_factura_proveedor"
      rules={[{ required: true, message: 'Ingrese el número de factura' }]}
    >
      <Input />
    </Form.Item>
  </>
);

export default CamposAdministrativos;
