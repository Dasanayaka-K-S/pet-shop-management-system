import React from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

const DataTable = ({ title, columns, data, onAdd, onEdit, onDelete }) => {
  return (
    <div className="data-table fade-in">
      {/* Header */}
      <div className="table-header">
        <div className="table-header-content">
          <h2 className="table-title">{title}</h2>
          <div className="table-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={`Search ${title.toLowerCase()}...`}
              />
            </div>
            <button className="btn-add" onClick={onAdd}>
              <Plus size={16} />
              Add {title.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.label || col.Header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  {columns.map((col, j) => {
                    const key = col.key || col.accessor;
                    return <td key={j}>{item[key]}</td>;
                  })}
                  <td>
                    <button className="btn-edit" onClick={() => onEdit(item)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(item)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
