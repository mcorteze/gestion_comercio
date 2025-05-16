import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Card, Spin, Alert, Modal, Button, Input, Form, message } from 'antd';
import moment from 'moment';
import './LogisticaComentarios.css';

const OperacionDetalleComentarios = ({ operacionId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState('');

  const [crearModalVisible, setCrearModalVisible] = useState(false);
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
    setComentarioEditado(comentario.comentario);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setComentarioSeleccionado(null);
    setComentarioEditado('');
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

  const handleGuardarEdicion = async () => {
    if (!comentarioEditado.trim()) {
      message.warning('El comentario no puede estar vacío');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/operaciones_comentarios/${comentarioSeleccionado.id}`, {
        comentario: comentarioEditado.trim(),
      });
      message.success('Comentario actualizado');
      handleCloseModal();
      fetchComentarios();
    } catch (err) {
      console.error('Error al actualizar comentario:', err);
      message.error('No se pudo actualizar el comentario');
    }
  };

  const handleEliminarComentario = async () => {
    Modal.confirm({
      title: '¿Eliminar comentario?',
      content: '¿Estás seguro que deseas eliminar este comentario? Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/operaciones_comentarios/${comentarioSeleccionado.id}`);
          message.success('Comentario eliminado');
          handleCloseModal();
          fetchComentarios();
        } catch (err) {
          console.error('Error al eliminar comentario:', err);
          message.error('No se pudo eliminar el comentario');
        }
      },
    });
  };

  if (loading) return <Spin className="loading-spinner" size="large" />;
  if (error) return <Alert className="error-alert" message={error} type="error" />;

  const comentariosOrdenados = comentarios.sort(
    (a, b) => new Date(b.fecha_comentario) - new Date(a.fecha_comentario)
  );

  return (
    <div className="comentarios-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Modal de detalle y edición */}
      <Modal
        title="Comentario"
        visible={modalVisible}
        onCancel={handleCloseModal}
        onOk={handleGuardarEdicion}
        okText="Guardar cambios"
        cancelText="Cerrar"
        footer={[
          <Button key="delete" danger onClick={handleEliminarComentario}>
            Eliminar
          </Button>,
          <Button key="cancel" onClick={handleCloseModal}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleGuardarEdicion}>
            Guardar cambios
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Comentario">
            <Input.TextArea
              rows={5}
              value={comentarioEditado}
              onChange={(e) => setComentarioEditado(e.target.value)}
            />
          </Form.Item>
          <p>
            <strong>Fecha original:</strong>{' '}
            {comentarioSeleccionado
              ? moment(comentarioSeleccionado.fecha_comentario).format('DD/MM/YYYY HH:mm')
              : ''}
          </p>
        </Form>
      </Modal>

      {/* Modal para agregar nuevo comentario */}
      <Modal
        title="Nuevo Comentario"
        visible={crearModalVisible}
        onCancel={handleCloseCrearModal}
        onOk={() => form.submit()}
        okText="Guardar"
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

export default OperacionDetalleComentarios;
