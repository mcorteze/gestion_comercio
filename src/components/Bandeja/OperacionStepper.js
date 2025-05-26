import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

import {
  FiClock,
  FiPackage,
  FiTruck,
  FiGlobe,
  FiHome,
  FiDollarSign,
  FiCheckCircle,
  FiList,
} from 'react-icons/fi';

import './OperacionStepper.css';

const { Text } = Typography;

const ESTADOS_OPERACION = [
  'Esperando confirmación',
  'En preparación',
  'En tránsito internacional',
  'Proceso de internación',
  'En tránsito nacional',
  'Entregado a bodega',
  'Proceso de costeo',
  'Completado',
];

const iconMap = {
  'Esperando confirmación': FiClock,
  'En preparación': FiPackage,
  'En tránsito internacional': FiGlobe,
  'Proceso de internación': FiList,
  'En tránsito nacional': FiTruck,
  'Entregado a bodega': FiHome,
  'Proceso de costeo': FiDollarSign,
  'Completado': FiCheckCircle,
  null: FiList,
};

const OperacionStepper = ({ operacionId }) => {
  const [operacion, setOperacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperacion = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/operaciones/${operacionId}`);
        setOperacion(response.data);
      } catch (error) {
        message.error('Error al obtener los datos de la operación');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperacion();
  }, [operacionId]);

  if (loading) return <Spin tip="Cargando datos de la operación..." />;

  const estadoActual = operacion.estado || null;
  const pasoActualIndex = ESTADOS_OPERACION.indexOf(estadoActual);

  return (
    <div>
        <div className="stepper-container-simple">
          <div className="steps-wrapper">
            {ESTADOS_OPERACION.map((estado, index) => {
              const Icon = iconMap[estado] || FiList;
              const isActive = index === pasoActualIndex;
              const isCompleted = index < pasoActualIndex;

              return (
                <div
                  key={estado}
                  className="step-item"
                >
                  {index !== ESTADOS_OPERACION.length - 1 && (
                    <div
                      className={`step-connector ${index < pasoActualIndex ? 'completed' : ''}`}
                    />
                  )}

                  <div
                    className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <Icon />
                  </div>

                  <div
                    className={`step-label ${isActive ? 'active-label' : ''} ${
                      isCompleted || isActive ? 'completed-label' : ''
                    }`}
                  >
                    {estado}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default OperacionStepper;
