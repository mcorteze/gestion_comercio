import React, { useState } from 'react';
import { BsGraphUp } from 'react-icons/bs';
import { GoContainer } from "react-icons/go";
import { GrUserWorker } from "react-icons/gr";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import CabezalSidebar from './components/CabezalSidebar.js';
import MonitorPage from './pages/MonitorPage.js';
import ClientesPage from './pages/Clientes/ClientesPage.js';
import ClientesCrearPage from './pages/Clientes/ClientesCrearPage.js';
import ClientesEditarPage from './pages/Clientes/ClientesEditarPage.js';
import ProveedoresPage from './pages/Proveedores/ProveedoresPage.js';
import ProveedoresCrearPage from './pages/Proveedores/ProveedoresCrearPage.js';
import ProveedoresEditarPage from './pages/Proveedores/ProveedoresEditarPage.js';
import OperacionesPage from './pages/Operaciones/OperacionesPage.js';
import OperacionesCrearPage from './pages/Operaciones/OperacionesCrearPage.js';
import OperacionesEditarPage from './pages/Operaciones/OperacionesEditarPage.js';
import LogisticaPage from './pages/Logistica/LogisticaPage.js';
import LogisticaEditarPage from './pages/Logistica/LogisticaEditarPage.js';

import './App.css';

const { Sider, Content } = Layout;

const AppContent = () => {
  const [collapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <CabezalSidebar />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['0']}>
          <Menu.Item key="0" icon={<BsGraphUp />}>
            <Link to="/">Monitor</Link>
          </Menu.Item>
          <Menu.Item key="1" icon={<FaUserTie />}>
            <Link to="/clientes">Clientes</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<GrUserWorker />}>
            <Link to="/proveedores">Proveedores</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<GoContainer />}>
            <Link to="/operaciones">Operaciones</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<MdOutlineSupportAgent />}>
            <Link to="/logistica">Logistica</Link>
          </Menu.Item>
        </Menu>
        
      </Sider>

      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<MonitorPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/:id" element={<ClientesEditarPage />} /> 
            <Route path="/crear_cliente/" element={<ClientesCrearPage />} />
            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/proveedores/:id" element={<ProveedoresEditarPage />} />
            <Route path="/crear_proveedor/" element={<ProveedoresCrearPage />} />
            <Route path="/operaciones" element={<OperacionesPage />} />
            <Route path="/operaciones/:id" element={<OperacionesEditarPage />} />
            <Route path="/crear_operacion" element={<OperacionesCrearPage />} />
            <Route path="/logistica" element={<LogisticaPage />} />
            <Route path="/logistica/:id" element={<LogisticaEditarPage />} />
            
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
