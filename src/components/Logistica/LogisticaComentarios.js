import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Card, Spin, Alert, Modal, Button, Input, Form, message } from 'antd';
import moment from 'moment';
import './LogisticaComentarios.css';

const LogisticaComentarios = ({ operacionId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false); // Modal de detalle
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  const [crearModalVisible, setCrearModalVisible] = useState(false); // Modal de crear
  const [form] = Form.useForm();

  useEffect(() => {
    fetchComentarios();
  }, [operacionId]);

  const fetchComentarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/operaciones/${operacionId}/comentarios`);
      setComentarios(response.data);
    } catch (err) {
      setError('Error al obtener los comentarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (comentario) => {
    setComentarioSeleccionado(comentario);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setComentarioSeleccionado(null);
  };

  const handleOpenCrearModal = () => {
    setCrearModalVisible(true);
  };

  const handleCloseCrearModal = () => {
    form.resetFields();
    setCrearModalVisible(false);
  };

  const handleCrearComentario = async (values) => {
    const nuevoComentario = {
      id_operacion: operacionId,
      comentario: values.comentario,
      fecha_comentario: moment().toISOString(),
    };

    try {
      await axios.post('http://localhost:3001/api/operaciones_comentarios', nuevoComentario);
      message.success('Comentario agregado correctamente');
      handleCloseCrearModal();
      fetchComentarios();
    } catch (err) {
      console.error('Error al crear comentario:', err);
      message.error('No se pudo agregar el comentario');
    }
  };

  const handleEditarComentario = async (values) => {
    const comentarioEditado = {
      comentario: values.comentario,
      fecha_comentario: moment().toISOString(),
    };

    try {
      await axios.put(`http://localhost:3001/api/operaciones_comentarios/${comentarioSeleccionado.id}`, comentarioEditado);
      message.success('Comentario editado correctamente');
      handleCloseModal();
      fetchComentarios();
    } catch (err) {
      console.error('Error al editar comentario:', err);
      message.error('No se pudo editar el comentario');
    }
  };

  const handleEliminarComentario = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/operaciones_comentarios/${comentarioSeleccionado.id}`);
      message.success('Comentario eliminado correctamente');
      handleCloseModal();
      fetchComentarios();
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      message.error('No se pudo eliminar el comentario');
    }
  };

  if (loading) return <Spin className="loading-spinner" size="large" />;
  if (error) return <Alert className="error-alert" message={error} type="error" />;

  const comentariosOrdenados = comentarios.sort(
    (a, b) => new Date(b.fecha_comentario) - new Date(a.fecha_comentario)
  );

  return (
    <div className="comentarios-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="comentarios-title">Comentarios de la operación</h2>
        <Button type="primary" onClick={handleOpenCrearModal}>
          Agregar comentario
        </Button>
      </div>

      <div className="comentarios-list-container">
        <List
          className="comentarios-list"
          dataSource={comentariosOrdenados}
          renderItem={(item) => (
            <Card className="comentarios-card" onClick={() => handleOpenModal(item)}>
              <p className="comentarios-text">
                {item.comentario.length > 150
                  ? `${item.comentario.substring(0, 150)}...`
                  : item.comentario}
              </p>
              <p className="comentarios-date">
                <small>{moment(item.fecha_comentario).format('DD/MM/YYYY HH:mm')}</small>
              </p>
            </Card>
          )}
        />
      </div>

      {/* Modal de detalle */}
      <Modal
        title="Comentario Completo"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <p>{comentarioSeleccionado?.comentario}</p>
        <p>
          <strong>Fecha:</strong>{' '}
          {comentarioSeleccionado
            ? moment(comentarioSeleccionado.fecha_comentario).format('DD/MM/YYYY HH:mm')
            : ''}
        </p>

        {/* Botones de Editar y Eliminar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                comentario: comentarioSeleccionado?.comentario,
              });
              setModalVisible(false);
              setCrearModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Button
            type="danger"
            onClick={handleEliminarComentario}
          >
            Eliminar
          </Button>
        </div>
      </Modal>

      {/* Modal para agregar nuevo comentario */}
      <Modal
        title={comentarioSeleccionado ? 'Editar Comentario' : 'Nuevo Comentario'}
        visible={crearModalVisible}
        onCancel={handleCloseCrearModal}
        onOk={() => form.submit()}
        okText={comentarioSeleccionado ? 'Guardar Cambios' : 'Guardar'}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleCrearComentario}>
          <Form.Item
            name="comentario"
            label="Comentario"
            rules={[{ required: true, message: 'Por favor ingresa un comentario' }]}
          >
            <Input.TextArea rows={5} placeholder="Escribe tu comentario aquí..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LogisticaComentarios;
