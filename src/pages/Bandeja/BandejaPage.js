import React, { useEffect, useState } from 'react';
import { Typography, List, Spin, Space, Row, Col, Tabs } from 'antd';
import { FaStar, FaTrash } from 'react-icons/fa';
import { IoFlagSharp } from "react-icons/io5";
import axios from 'axios';
import './BandejaPage.css';
import OperacionDetalle from '../../components/Bandeja/OperacionDetalle';
import EstadoPanel from '../../components/Bandeja/EstadoPanel';

const { Text } = Typography;
const { TabPane } = Tabs;

const formatDateTime_Simple = (value) => {
  return value ? new Date(value).toLocaleDateString() : '—';
};

const BandejaPage = () => {
  const [operaciones, setOperaciones] = useState([]);
  const [filteredOperaciones, setFilteredOperaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOperacion, setSelectedOperacion] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [mostrarSoloDestacados, setMostrarSoloDestacados] = useState(false);

  useEffect(() => {
    const fetchOperaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/operaciones');
        setOperaciones(response.data);
        setFilteredOperaciones(response.data);
      } catch (error) {
        console.error('Error al obtener operaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperaciones();
  }, []);

  const aplicarFiltros = (estado, soloDestacados) => {
    let resultado = operaciones;

    if (estado !== null) {
      resultado = resultado.filter(op => op.estado === estado);
    }

    if (soloDestacados) {
      resultado = resultado.filter(op => op.destacado);
    }

    setFilteredOperaciones(resultado);
  };

  const handleEstadoFilter = (estado) => {
    setEstadoSeleccionado(estado);
    aplicarFiltros(estado, mostrarSoloDestacados);
    setSelectedOperacion(null);
  };

  const handleTabChange = (key) => {
    const soloDestacados = key === 'destacados';
    setMostrarSoloDestacados(soloDestacados);
    aplicarFiltros(estadoSeleccionado, soloDestacados);
  };

  const toggleDestacado = async (id, currentValue) => {
    try {
      const nuevoValor = !currentValue;
      await axios.patch(`http://localhost:3001/api/operaciones/${id}/destacado`, {
        destacado: nuevoValor,
      });

      setOperaciones(prev =>
        prev.map(op =>
          op.id === id ? { ...op, destacado: nuevoValor } : op
        )
      );
      setFilteredOperaciones(prev =>
        prev.map(op =>
          op.id === id ? { ...op, destacado: nuevoValor } : op
        )
      );
    } catch (error) {
      console.error('Error al actualizar destacado:', error);
    }
  };

  return (
    <div className="page-full bandeja-container">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={16} className="bandeja-row">
          {/* Panel de Estados */}
          <Col xs={24} sm={6} md={5} className="bandeja-col-estados">
            <EstadoPanel
              operaciones={operaciones}
              estadoSeleccionado={estadoSeleccionado}
              onEstadoSeleccionado={handleEstadoFilter}
            />
          </Col>

          {/* Panel Asunto */}
          <Col xs={24} sm={9} md={7} className="bandeja-col-asuntos">
            <Tabs defaultActiveKey="todos" onChange={handleTabChange} className = "bandeja-asunto-tab" style={{ paddingInline: 30, marginBottom: 0 }}>
              <TabPane tab="Todos" key="todos" />
              <TabPane tab="Importantes" key="destacados" />
            </Tabs>

            <List
              className="asunto-list"
              dataSource={filteredOperaciones}
              itemLayout="vertical"
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className={`asunto-item ${selectedOperacion?.id === item.id ? 'asunto-item-activo' : ''}`}
                  onClick={() => setSelectedOperacion(item)}
                >
                  <div className="asunto-item-inner">
                    <div className="asunto-content">
                      <span>Proveedor: {item.nombre_proveedor}</span>
                      <span>Transporte: {item.tipo_transporte}</span>
                      <span>ETA: {formatDateTime_Simple(item.f_eta)}</span>
                    </div>

                    <div className="asunto-acciones">
                      <span
                        className={`icono-accion estrella-icono ${item.destacado ? 'estrella-activa' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestacado(item.id, item.destacado);
                        }}
                      >
                        <IoFlagSharp size={14} />
                      </span>

                      <span
                        className="icono-accion icono-trash"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Acción aún no implementada.');
                        }}
                      >
                        <FaTrash size={14} />
                      </span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Col>

          {/* Panel de Detalles */}
          <Col xs={24} sm={24} md={selectedOperacion ? 12 : 0} className="bandeja-col-detalles">
            {selectedOperacion ? (
              <OperacionDetalle operacionId={selectedOperacion.id} />
            ) : (
              <Text type="secondary">Selecciona una operación para ver sus detalles.</Text>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BandejaPage;
