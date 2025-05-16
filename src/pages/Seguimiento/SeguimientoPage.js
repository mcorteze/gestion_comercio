import React from 'react';
import { Tabs } from 'antd';
import LogisticaPage from '../Logistica/LogisticaPage';  // ajusta la ruta según corresponda
import BandejaPage from '../Bandeja/BandejaPage';      // ajusta la ruta según corresponda
import './SeguimientoPage.css';

const { TabPane } = Tabs;

const SeguimientoPage = () => {
  return (
    <div className = "page-full seguimiento-page" style={{ width: '100%' }}>
    <h1>Logística de Operaciones</h1>
      <Tabs tabPosition="left" style={{ height: '100%' }}>
        <TabPane tab="Panel de Tabla" key="1">
          <LogisticaPage />
        </TabPane>
        <TabPane tab="Panel de Bandeja" key="2">
          <BandejaPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SeguimientoPage;
