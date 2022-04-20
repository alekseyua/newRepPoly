import React from 'react';
import './styles/index.module.scss';

import CloseBtn from './CloseBtn';
import ModalWrapper from './ModalWrapper';

const ModalPreviewFile = ({ children, customClassName = 'modal-preview_file', closeModal }) => {
  
  return (
    <>

      <CloseBtn closeModal={closeModal} />
    <div className={customClassName}>{children}</div>
    </>

  )
};
export default React.memo(ModalPreviewFile);
