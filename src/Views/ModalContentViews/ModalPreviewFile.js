import React from 'react';
import './styles/index.module.scss';
const ModalPreviewFile = ({ children, customClassName = 'modal-preview_file' }) => {
  
  return <div className={customClassName}>{children}</div>;
};
export default React.memo(ModalPreviewFile);
