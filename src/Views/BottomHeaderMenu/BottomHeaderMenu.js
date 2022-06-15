import React, { useEffect, useRef, useState } from 'react';
import style from './bottomHeaderMenu.module.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { v4 } from 'uuid';

const BottomHeaderMenu = ({ main_menu = [], isScrolled }) => {
  const [activeIndex, setActiveIndex] = useState();
  const clickOutMenuItemRef = useRef();

  return (
    <div
      className={classNames({
        [style['bottom-header-menu']]: true,
        [style['scrolled']]: isScrolled,
      })}
    >
      <div className={style['container']}>
        <ul className={style['bottom-header-menu__list']}
          ref={clickOutMenuItemRef}
        >
          <AnimateSharedLayout>
            {main_menu.map((el, i) => (
              <MenuItems
                key={v4()}
                el={el}
                i={i}
                isSelected={activeIndex === i}
                handleClick={() => setActiveIndex(i)}
              />
            ))}
          </AnimateSharedLayout>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(BottomHeaderMenu);

const MenuItems = ({ el, isSelected, handleClick = Function.prototype, i, fucRef }) => {
  return (
    <li key={i} className={style['bottom-header-menu__li']}    >
      <Link
        key={i * v4()}
        to={el.url}
      >
          {el.title}
      </Link>
    </li>
  );
};