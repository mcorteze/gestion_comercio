import { Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;

const CamposComerciales = ({ clientes, proveedores }) => (
  <>
    <Form.Item
      label="Cliente"
      name="cliente_id"
      rules={[{ required: true, message: 'Seleccione un cliente' }]}
    >
      <Select placeholder="Seleccionar cliente">
        {clientes.map((c) => (
          <Option key={c.id} value={c.id}>
            {c.nombre}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Proveedor"
      name="proveedor_id"
      rules={[{ required: true, message: 'Seleccione un proveedor' }]}
    >
      <Select placeholder="Seleccionar proveedor">
        {proveedores.map((p) => (
          <Option key={p.id} value={p.id}>
            {p.nombre}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Fecha de Envío SOC"
      name="f_envio_soc"
      rules={[{ required: true, message: 'Seleccione la fecha de envío SOC' }]}
    >
      <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
    </Form.Item>

    <Form.Item
      label="Incoterm"
      name="incoterm"
      rules={[{ required: true, message: 'Ingrese el incoterm' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Moneda"
      name="moneda"
      rules={[{ required: true, message: 'Ingrese la moneda' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Calidad"
      name="calidad"
      rules={[{ required: true, message: 'Ingrese la calidad' }]}
    >
      <Input />
    </Form.Item>
  </>
);

export default CamposComerciales;
