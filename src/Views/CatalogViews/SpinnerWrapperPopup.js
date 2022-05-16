import React from 'react';
import style from './styles/index.module.scss';

const SpinnerWrapperPopup = ({ children }) => {
  return <div className={style["spinner__wrapper-popup"]}>{children}</div>;
};

export default React.memo(SpinnerWrapperPopup);
