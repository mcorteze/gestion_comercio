import React, { useState, useEffect } from 'react';
import { Button, Select, Row, Col, Typography, Table, message, Tooltip, Modal } from 'antd';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogisticaEditarPage from '../../pages/Logistica/LogisticaEditarPage'; // Ajusta la ruta correcta

const { Paragraph, Title } = Typography;
const { Option } = Select;

const CrearOperacionModal = ({ loading: loadingCrear }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operaciones, setOperaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState(null);

  // Estado para modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOperacionId, setModalOperacionId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [operacionesRes, proveedoresRes] = await Promise.all([
          axios.get('http://localhost:3001/api/operaciones'),
          axios.get('http://localhost:3001/api/proveedores'),
        ]);
        setOperaciones(operacionesRes.data);
        setProveedores(proveedoresRes.data);
      } catch (err) {
        console.error(err);
        setError('Error al obtener datos');
        message.error('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProveedorChange = (value) => {
    setSelectedProveedorId(value);
  };

  const handleOperacionSeleccionada = (tipo, operacion = null) => {
    if (tipo === 'blanco') {
      navigate('/crear_operacion'); // ✅ blanco
    } else if (tipo === 'plantilla' && operacion?.id) {
      navigate(`/crear_operacion/${operacion.id}`); // ✅ plantilla
    }
  };

  const abrirModalOperacion = (id) => {
    setModalOperacionId(id);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setModalOperacionId(null);
  };

  const operacionesFiltradas = selectedProveedorId
    ? operaciones.filter((op) => op.proveedor_id === selectedProveedorId)
    : [];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Número Orden Compra',
      dataIndex: 'numero_orden_compra',
      key: 'numero_orden_compra',
      width: 160,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Fecha ETD',
      dataIndex: 'f_etd',
      key: 'f_etd',
      width: 120,
      render: (text) => text || 'N/A',
      sorter: (a, b) => new Date(a.f_etd) - new Date(b.f_etd),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 50,
      render: (_, record) => (
        <Tooltip title="Ver operación">
          <Button
            icon={<IoSearch />}
            onClick={(e) => {
              e.stopPropagation(); // evita que se dispare el onClick de la fila
              abrirModalOperacion(record.id);
            }}
            className="action-button search"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {loading && <Paragraph>Cargando datos...</Paragraph>}
      {error && <Paragraph type="danger">{error}</Paragraph>}

      {!loading && !error && (
        <Row gutter={24} style={{ fontSize: 14 }}>
          <Col span={10} style={{ borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
            <Title level={5} style={{ marginBottom: 12 }}>
              Crear operación en blanco
            </Title>
            <Button
              type="primary"
              block
              size="middle"
              loading={loadingCrear}
              onClick={() => handleOperacionSeleccionada('blanco')}
            >
              Crear operación
            </Button>
          </Col>

          <Col span={14} style={{ paddingLeft: 16 }}>
            <Title level={5} style={{ marginBottom: 12 }}>
              Crear a partir de otra operación
            </Title>
            <Select
              showSearch
              placeholder="Seleccione un proveedor"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%', marginBottom: 12 }}
              value={selectedProveedorId}
              onChange={handleProveedorChange}
              allowClear
              size="middle"
              loading={loading}
            >
              {proveedores.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nombre}
                </Option>
              ))}
            </Select>

            {selectedProveedorId && operacionesFiltradas.length === 0 && (
              <Paragraph style={{ fontStyle: 'italic' }}>
                No hay operaciones para este proveedor.
              </Paragraph>
            )}

            {operacionesFiltradas.length > 0 && (
              <Table
                size="small"
                dataSource={operacionesFiltradas}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 200 }}
                style={{ marginTop: 8 }}
                onRow={(record) => ({
                  onClick: () => handleOperacionSeleccionada('plantilla', record),
                  style: { cursor: 'pointer' },
                })}
              />
            )}
          </Col>
        </Row>
      )}

      <Modal
        visible={modalVisible}
        onCancel={cerrarModal}
        footer={null}
        width={1200}
        destroyOnClose
        title={`Detalle Operación #${modalOperacionId}`}
      >
        {modalOperacionId && <LogisticaEditarPage id={modalOperacionId} />}
      </Modal>
    </>
  );
};

export default CrearOperacionModal;
