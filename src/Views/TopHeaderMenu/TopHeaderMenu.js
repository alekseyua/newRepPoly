import React, { useState, useEffect, useRef } from 'react';
import { GxIcon } from '@garpix/garpix-web-components-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import style from './topHeaderMenu.module.scss';
import { dropdownIcon } from '../../images';
import { motion} from 'framer-motion';
import { useStoreon } from 'storeon/react';

const TopHeaderMenu = ({ handlerActiveDropDownMenuItem }) => {
  const [activeDropDown, setActiveDropDown] = useState(-1);
  const { userPage } = useStoreon('userPage');
  const {header_menu} = userPage;
  const clickOutRef = useRef();
  const classNameBlock = classNames({
    [style['top-header-menu']]: true,
  }); 

  useEffect(() => {
    const onClick = e => clickOutRef.current.contains(e.target) || setActiveDropDown(-1);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
    <div className={classNameBlock}>
        
      <ul className={style['top-header-menu__list']}>
        {header_menu.map((el, i) => {
          return (
            <motion.li
              ref={clickOutRef}
              onClick={(e) => {
                if (el.children.length) {
                  setActiveDropDown(i === activeDropDown ? -1 : i);
                  handlerActiveDropDownMenuItem(i === activeDropDown);
                } else {
                  setActiveDropDown(-1);
                  handlerActiveDropDownMenuItem(i !== activeDropDown);
                }
              }}
              key={`${el.id} ${i}`}
              data-cy={
                el.children.length ? 'header_menu_dropdown_btn' : 'header_menu_dropdown_link'
              }
              className={classNames({
                [style['top-header-menu__li']]: true,
                [style['active']]: activeDropDown === i,
                [style['parent']]: el.children.length !== 0,
              })}
            >
              <div 
                className={style['top-header-menu__li-item']}
                dataintro={el.id === 5? "step3" : ""}
              >
                
                {el.children.length ? (
                  <p>{el.title}</p>
                ) : (
                  <NavLink
                    key={`${el.id} ${i * 2}`}
                    data-cy={`header_menu_dropdown_cypress-link-${el.id}`}
                    to={el.url ? el.url : '#'}
                    className={classNames({
                      [style['light']]: true,
                      [style['item-modificator']]: true,
                    })}
                  >
                    {el.title}
                  </NavLink>
                )}
                <GxIcon
                  src={dropdownIcon}
                  className={classNames({
                    [style['top-header-menu__dropdown']]: true,
                    [style['active']]: activeDropDown === i,
                  })}
                />
              </div>
              {el.children.length ? (

                activeDropDown !==-1?
               ( <motion.div
                transition={{
                  duration: 1.5,

                }}
                initial={{
                  y:-100,
                  opacity: 0
                }}
                animate={{
                  y: 463 ,
                  opacity:1
                }}
                  className={classNames({
                    [style['top-header-submenu']]: true,
                    [style['active']]: activeDropDown !== -1,
                  })}
                >
                 
                  <ul                     
                    className={style['top-header-submenu__list']}>
                    {el.children.map((elChild, iChild) => {
                      return (
                        <NavLink
                        key={iChild*2}
                        data-cy={`header_menu_redirect_to-${elChild.id}`}
                        to={elChild.url ? elChild.url : '#'}
                        >
                        <motion.li
                        className={style['item-list']}
                          key={iChild}
                          transition={{
                            duration: .3,
                          }}
                          animate={{
                            opacity: .5
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            opacity: 1
                          }}
                          whileTap={{ scale: 0.95 }}                      
                          custom={iChild}
                        >
                          {elChild.title}
                         </motion.li>
                        </NavLink>
                      );
                    })}
                  </ul>
                </motion.div>
                   ):null
              ) : null}
            </motion.li>
          );
        })}
      </ul>
    </div>
    </>
  );
};

export default React.memo(TopHeaderMenu);
