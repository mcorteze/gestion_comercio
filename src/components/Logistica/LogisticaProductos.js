import React, { useEffect, useState } from "react";
import { List, Spin, Alert, Button, Typography, Modal, message } from "antd";
import { LuBox } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import axios from "axios";
import ModalProductoForm from "./LogisticaProductosForm";
import "./LogisticaProductos.css";

const { Title, Text } = Typography;
const { confirm } = Modal;

const LogisticaProductos = ({ operacionId }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, [operacionId]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3001/api/operaciones/${operacionId}/productos`
      );
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setProductoSeleccionado(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProductoSeleccionado(null);
  };

  const onProductoGuardado = () => {
    fetchProductos();
    cerrarModal();
  };

  // Función para confirmar y eliminar producto
  const confirmarEliminarProducto = (producto) => {
    confirm({
      title: "¿Estás seguro de eliminar este producto?",
      content:
        "Esta acción no se puede deshacer. El producto será eliminado permanentemente.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/productos/${producto.id}`);
          message.success("Producto eliminado correctamente");
          fetchProductos();
        } catch (error) {
          console.error("Error al eliminar producto", error);
          message.error("No se pudo eliminar el producto");
        }
      },
    });
  };

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={abrirModalCrear}>
          Agregar producto
        </Button>
      </div>

      <div className="log-prod-scrollable">
        <List
          dataSource={productos}
          split={false}
          renderItem={(item, index) => (
            <List.Item style={{ padding: "0px 0" }}>
              <div className="log-prod-card">
                <div className="log-prod-index">{`${index + 1}/${productos.length}`}</div>

                <div className="log-prod-header">
                  <div className="log-prod-header-left">
                    <LuBox className="log-prod-icon" />
                    <span className="log-prod-sku">SKU: {item.codigo_sku}</span>
                  </div>

                  <div className="log-prod-header-info">
                    Cant. Solicitada: {item.cantidad_solicitada} &nbsp;|&nbsp; Cant. Facturada:{" "}
                    {item.cantidad_facturada}
                  </div>

                  <div className="log-prod-header-buttons">
                    <RiEdit2Line
                      className="log-icon-button"
                      onClick={() => abrirModalEditar(item)}
                    />
                    <FaTrashAlt
                      className="log-icon-button delete"
                      onClick={() => confirmarEliminarProducto(item)}
                    />
                  </div>
                </div>

                <div className="log-prod-info">
                  <div className="log-prod-grid">
                    <div>
                      <strong>Tipo:</strong> {item.tipo_producto}
                    </div>
                    <div>
                      <strong>Categoría Área:</strong> {item.categoria_area}
                    </div>
                    <div>
                      <strong>Unidad:</strong> {item.unidad_medida}
                    </div>
                    <div>
                      <strong>Precio unitario:</strong> ${item.precio_unitario}
                    </div>
                    <div>
                      <strong>Costo total:</strong> ${item.costo_total}
                    </div>
                  </div>
                </div>

                <div className="log-prod-descripcion">
                  <strong>Descripción:</strong> {item.descripcion_producto}
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <ModalProductoForm
        visible={modalVisible}
        onClose={cerrarModal}
        onSuccess={onProductoGuardado}
        operacionId={operacionId}
        producto={productoSeleccionado}
      />
    </div>
  );
};

export default LogisticaProductos;
