// components/ColumnFilter.js
import React from 'react';
import { Checkbox, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import './ColumnFilter.css';

const ColumnFilter = ({ dataIndex, operaciones, columnFilters, handleColumnFilterChange, getDisplayValue }) => {
  const values = [...new Set(operaciones.map(op =>
    getDisplayValue ? getDisplayValue(op[dataIndex]) : op[dataIndex]
  ))].filter(v => v !== undefined && v !== null);

  const selectedValues = columnFilters[dataIndex] || [];

  return {
    filterDropdown: ({ confirm }) => (
      <div style={{ padding: 8 }}>
        <Checkbox
          checked={selectedValues.length === 0}
          onChange={() => {
            handleColumnFilterChange(dataIndex, []);
            confirm();
          }}
        >
          Todos
        </Checkbox>
        <div style={{ maxHeight: 150, overflowY: 'auto', marginTop: 8 }}>
          {values.map((val) => (
            <div key={val}>
              <Checkbox
                checked={selectedValues.includes(val)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...selectedValues, val]
                    : selectedValues.filter((v) => v !== val);
                  handleColumnFilterChange(dataIndex, newValues);
                }}
              >
                {val}
              </Checkbox>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Aplicar
          </Button>
          <Button
            onClick={() => {
              handleColumnFilterChange(dataIndex, []);
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </div>
      </div>
    ),
    filterIcon: () => <CaretDownOutlined />,
    filtered: selectedValues.length > 0,
    className: selectedValues.length > 0 ? 'filtered-column' : '',
  };
};

export default ColumnFilter;
