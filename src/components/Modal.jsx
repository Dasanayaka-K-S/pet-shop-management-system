import React from "react";

const Modal = ({ isOpen, title, children, onCancel, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>

        <form
          className="modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}

          <div className="modal-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
