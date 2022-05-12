import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './styles/index.module.scss';

const ViewsImage = ({ image, url = '' }) => {

  return (
    <div className={style['preview-image']}>
      <NavLink to={url} >
        <img src={image} />
      </NavLink>
    </div>
  );
};

export default React.memo(ViewsImage);
