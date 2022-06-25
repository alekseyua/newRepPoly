import React from 'react';
import style from './bottomHeader.module.scss';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import { useStoreon } from 'storeon/react';

const RelativeBurgerBtn = () => {
  const { userPage } = useStoreon('userPage');
  const {header_menu, site_configuration} = userPage;
  return (
    <div className={style['bottom-header__burger-wrapper']}>
      <BurgerMenu itemIds={header_menu[4].children} site_configuration={site_configuration}/>
    </div>
  );
};

export default React.memo(RelativeBurgerBtn);
