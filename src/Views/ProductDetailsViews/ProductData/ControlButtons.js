import React, { useState, useEffect, createRef } from 'react';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import { shoppingIcon } from '../../../images';
import style from '../styles/index.module.scss';
import Button from '../../Button';
import { useStoreon } from 'storeon/react';
import classnNames from 'classnames';
import { ROLE } from '../../../const'
import { checkLocalStorage } from '../../../utils';

const ControlButtons = ({
  in_cart_count,
  addToCart,
  modalView,
  url,
  collections, //boolen
  changeColorBtn,
  setChangeColorBtn,
  is_collection, //
  sizes,
  role,
  productId,
}) => {
  console.log('productId:1', productId)
  const { stateCountCart, dispatch } = useStoreon('stateCountCart');
  const [ countInBtn, setCountInBtn ] = useState()
  const cartRef = createRef();
  const cloneCart = () =>{
    const cloneIcon = cartRef.current.cloneNode(true)
    const cloneIconWidth = cartRef.current.offsetWidth;//ширина изображения
    const cloneIconHeight = cartRef.current.offsetHeight;// высота изображения
    const cloneIconTop = cartRef.current.getBoundingClientRect().top;// позиция изображения на странице от верха
    const cloneIconLeft = cartRef.current.getBoundingClientRect().left;//позиция изображения на странице от левого края
    //присваиваем стили нашей картинке
    cloneIcon.setAttribute('class', '_flyImage');
    cloneIcon.style.cssText = `
      left: ${cloneIconLeft}px;
      top:  ${cloneIconTop}px;
      width: ${cloneIconWidth}px;
      height: ${cloneIconHeight}px;
    `
    //добавляем клон на страницу
    document.body.append(cloneIcon)
    // получаем координаты карзины по id 'cart-id'
    const getCartId = document.querySelector('#cart-id')
    const getCartIdTop = getCartId.getBoundingClientRect().top;// позиция изображения на странице от верха
    const getCartIdLeft = getCartId.getBoundingClientRect().left;// позиция изображения на странице от левого края
   
    cloneIcon.style.cssText = `
      left: ${getCartIdLeft}px;
      top:  ${getCartIdTop}px;
      width: 0;
      height: 0;
      opacity: 0;
      transform: scale(.5)
    `
    const timer = setTimeout(() => {
      cloneIcon.remove()
      return () => clearTimeout(timer)
    }, 4000)
  }

  //******************************************************************************************************* */
  const addToCartProduct = (count, isRemoved = false, productId) => {
    let idProductStorage = null;
    if (checkLocalStorage('productId')){
      idProductStorage = +localStorage.getItem('productId');
    }
  
    (count === 1) ? setChangeColorBtn({ red: false, green: true }) : null;
    (count === -1) ? setChangeColorBtn({ red: true, green: false }) : null;
    const openModalSucces = (idProductStorage !== productId) ? true : false;
    let countInCart;
    countInCart = collections? sizes.lenght : count
    countInCart === undefined? countInCart = 0 : countInCart = collections? sizes.lenght : count;
    dispatch('stateCountCart/add', { ...stateCountCart, in_cart: stateCountCart.in_cart + countInCart})
    count = countInBtn + count;
    setCountInBtn(count)
    addToCart({ count, openModalSucces });
  };

  useEffect(()=>{
    in_cart_count !== countInBtn ? setCountInBtn(in_cart_count) : null
  },[in_cart_count])

  //*******************меняем стиль на кнопке зелёный или красный*** проверено работает***************************************** */
  const [colorBtnClick, setColorBtnClick] = useState('prodpage-control-buttons__indicator');
  useEffect(() => {
    let styleColor = (classnNames({
      [style['prodpage-control-buttons__indicator--color__red']]: changeColorBtn.red,
      [style['prodpage-control-buttons__indicator--color__green']]: changeColorBtn.green,
    })
    )
    setColorBtnClick(styleColor)
  }, [changeColorBtn.red, changeColorBtn.green])

  //******************************************************************************************************* */
  const linkToProductPage = () => {
    if (!modalView) return null;
    return (
      <Button href={url} full variant={'catalog-link-transparent__modal'}>
        перейти на страницу товара
      </Button>
    );
  };

  if (in_cart_count) {
    return (
      <div className={style['prodpage-control-buttons']}>
        <div className={style['prodpage-control-buttons__counter']}>
          <GxButton
            onClick={(e) => {
              cloneCart(e)
              addToCartProduct(- 1, true, productId);
            }}
            className={style['prodpage-control-buttons__add-button']}
          >
            -
          </GxButton>
          <p className={colorBtnClick}>
          <GxIcon 
          ref={cartRef}
          slot="icon-left" 
          src={shoppingIcon}></GxIcon>
            <span 
              className={style['prodpage-control-buttons__add-to-cart--span']}
            > в корзине: {countInBtn} {is_collection && role === ROLE.WHOLESALE? 'ряд(а)' : 'шт.'}</span>
          </p>
          <GxButton
            onClick={(e) => {
              cloneCart(e)
              addToCartProduct(1, false, productId);
            }}
            className={style['prodpage-control-buttons__down-button']}
          >
            +
          </GxButton>
        </div>
        {linkToProductPage()}
      </div>
    );
  }else{
    return (
    <div className={style['prodpage-control-buttons']}>
      <div className={style['prodpage-control-buttons__add']}>
        <GxButton
          onClick={(e) => {
            cloneCart(e)
            addToCartProduct(1, false, productId);
          }}
          className={style['prodpage-control-buttons__add-to-cart']}
        >
          <GxIcon 
          ref={cartRef}
          slot="icon-left" 
          src={shoppingIcon}></GxIcon>
          добавить в корзину
        </GxButton>
      </div>
      {linkToProductPage()}
    </div>
    )
  }
};
export default ControlButtons;