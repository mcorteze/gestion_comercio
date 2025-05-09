import { Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;

const CamposLogistica = ({ clientes, proveedores }) => (
  <>
    <Form.Item
        label="Tipo de Transporte"
        name="tipo_transporte"
        rules={[{ required: true, message: 'Ingrese el tipo de transporte' }]}
    >
        <Input />
    </Form.Item>
    <Form.Item
        label="Número BL / AWB / CRT"
        name="numero_bl_awb_crt"
        rules={[{ required: true, message: 'Ingrese el número de transporte' }]}
    >
        <Input />
    </Form.Item>
    <Form.Item
        label="Puerto de Embarque"
        name="puerto_embarque"
        rules={[{ required: true, message: 'Ingrese el puerto de embarque' }]}
    >
        <Input />
    </Form.Item>
    <Form.Item
        label="Puerto de Destino"
        name="puerto_destino"
        rules={[{ required: true, message: 'Ingrese el puerto de destino' }]}
    >
        <Input />
    </Form.Item>
    <Form.Item
        label="Fecha ETD"
        name="f_etd"
        rules={[{ required: true, message: 'Seleccione la fecha ETD' }]}
    >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
    </Form.Item>
    <Form.Item
        label="Fecha ETA"
        name="f_eta"
        rules={[{ required: true, message: 'Seleccione la fecha ETA' }]}
    >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
    </Form.Item>
    <Form.Item
        label="Fecha Envío Documentos Intercomex"
        name="f_envio_dctos_intercomex"
        rules={[{ required: true, message: 'Seleccione la fecha de envío' }]}
    >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
    </Form.Item>
    <Form.Item
                  label="Fecha Pago a Proveedor"
                  name="f_pago_proveedor"
                  rules={[{ required: true, message: 'Seleccione la fecha de pago al proveedor' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                  label="Fecha Pago de Derechos"
                  name="f_pago_derechos"
                  rules={[{ required: true, message: 'Seleccione la fecha de pago de derechos' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                  label="Días Libres"
                  name="dias_libres"
                  rules={[{ required: true, message: 'Ingrese los días libres' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  label="Condición de Pago (Días)"
                  name="condicion_pago_dias"
                  rules={[{ required: true, message: 'Ingrese la condición de pago' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  label="Estado"
                  name="estado"
                  rules={[{ required: true, message: 'Seleccione el estado' }]}
                >
                  <Select placeholder="Seleccionar estado">
                    <Option value="Pendiente">Pendiente</Option>
                    <Option value="En Proceso">En Proceso</Option>
                    <Option value="Completado">Completado</Option>
                    <Option value="Rechazado">Rechazado</Option>
                  </Select>
                </Form.Item>
  </>
);

export default CamposLogistica;
