import React, { useState, useEffect, useRef } from 'react';
import { GxGrid } from '@garpix/garpix-web-components-react';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import style from './topHeaderMenu.module.scss';
import { dropdownIcon } from '../../images';
import SearchInput from '../SearchPageViews/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';

import introJs from 'intro.js';
import 'intro.js/introjs.css';
import "intro.js/themes/introjs-modern.css";
/**
 * ? Поля доступные в меню 
 * ? children: []
 * ? css_class: null
 * ? edition_style: ""
 * ? id: 1
 * ? image: null
 * ? is_only_for_authenticated: false
 * ? page: 1
 * ? target_blank: false
 * ? title: "Главная"
 * ? url: "/"
 * @param {*} header_menu
 */
const TopHeaderMenu = ({ header_menu = [], handlerActiveDropDownMenuItem, classModificator }) => {
  const [activeDropDown, setActiveDropDown] = useState(-1);
  const [clickActiveCurrencies, setClickActiveCurrencies] = useState(false);
  const clickOutRef = useRef();
  const classNameBlock = classNames({
    [style['top-header-menu']]: true,
    [style[classModificator]]: !!classModificator,
  });
 

  const variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const variantsLi = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  useEffect(() => {
    const onClick = e => clickOutRef.current.contains(e.target) || setActiveDropDown(-1)

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click',onClick)
  }, [])

  useEffect(()=>{
      //introJs().start()
  },[])

//data-intro={'Вот так будет выглядит инструкция для знакомства с сайтом'} 

  return (
    <>


    <div className={classNameBlock} dataintro="step1">
        
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
              <div className={style['top-header-menu__li-item']}>
                
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
                // exit={{y: 0,opacity:0}}
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
                        // className={style['item-modificator']}
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
                          // variants={variantsLi}
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
