import React, { useState } from 'react';
import { GxHamburger } from '@garpix/garpix-web-components-react';
import TopHeaderMenu from '../TopHeaderMenu';
import style from './bottomHeader.module.scss';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

const RelativeBurgerBtn = ({ header_menu, site_configuration }) => {
  const [classModificator, setClassModificator] = useState('hidden');
  const handlerDropDown = (e) => {
    setClassModificator(e.detail.isActive ? 'visible' : 'hidden');
  };
  return (
    <div className={style['bottom-header__burger-wrapper']}>

      <BurgerMenu itemIds={header_menu[4].children} site_configuration={site_configuration}/>

      {/* <GxHamburger onGxShow={handlerDropDown} className={style['bottom-header__burger-button']}>
        Кнопка
      </GxHamburger> */}
      {classModificator === 'visible' ? (
        <TopHeaderMenu
          classModificator={classModificator}
          handlerActiveDropDownMenuItem={() => {}}
          header_menu={header_menu}
        />
      ) : null}
    </div>
  );
};

export default React.memo(RelativeBurgerBtn);
