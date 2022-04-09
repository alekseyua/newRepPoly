import React, { useEffect, useState } from 'react';
import CheckBox from '../CheckBox';
import { categoryCard1, closeJustIcon, closeRed } from '../../images';
import Button from '../Button';
import { GxInput, GxIcon } from '@garpix/garpix-web-components-react';
import style from './styles/index.module.scss';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"
const Card = ({
  cart,
  comment,
  conditions,
  id,
  hideSales,
  old_price,
  price,
  product,
  total_item_price,
  condition = '',
  qty,
  selected,
  total_price,
  updateProductFromCart,
  deleteProductFromCart,
  currentCurrcensies,
  is_packColor,
  is_packSize,
  is_packUrl,
  is_packPrice,
  cartitem_setUrl = '#',
  url
}) => {
  const { brand, color, id: producId, image, in_stock_count, size, title } = product;

  const [countProducts, setCountProducts] = useState()
  const [select, setSelect] = useState()
  const [stateAction, setStateAction] = useState();

 useEffect(()=>{
  setSelect(selected)
},[selected])

  const updateQty = (qty) => {
    updateProductFromCart({
        id: id,
        selected: selected,
        qty: qty,
        oldQty: countProducts,
        is_collection : true
      });      
   
  };
  const decCounterProduct = () => {
    if (countProducts <= 1) return;
    setCountProducts(countProducts - 1);
    updateQty(countProducts - 1);
  };
  const incCounterProduct = () => {
    setCountProducts(countProducts + 1);
    updateQty(countProducts + 1);
  };
  useEffect(() => {
    setCountProducts(qty);
  }, [qty]);

  if (!product.image || product.image === '#') product.image = categoryCard1;
  // ***************************************************
  const changeValueCounterProduct = (e) => {
    let value = Number(e.target.value);
    (value === 0) ? value = 1 : null;
    isNaN(value) ? value = countProducts : value;
    in_stock_count?
      (value >= in_stock_count)? value = in_stock_count : value
      :null
    setCountProducts(value)
      updateQty(value);
  }
  return (
    <motion.div
      initial={{
        x: 0,
        opacity: 1
      }}
      transition={{
        duration: .8
      }}
      animate={stateAction}
    className={style['wrapper']}>
      <div className={style['product__wrapper-block']}>
        <CheckBox
          checked={select}
          className={'product__selected_checkbox'}
          onClick={(e) => {
            const value = e.target.checked;
              select !== value ? setSelect(!select) : null
              if (value !== null && select !== value){
                setSelect(!select)
                updateProductFromCart({
                  id: id,
                  selected: value,
                  qty: countProducts,
                });}

          }}
        />
        {/*фотография  */}
        <Link
          to={url}//{is_packUrl ? is_packUrl : cartitem_setUrl}
        > 
          <img
            src={image && image !== '#' ? image : categoryCard1}
            className={style['product__image_thumb']}
          />
        </Link>
          {/* инфо о товаре */}
        <div className={style['product__base_info']}>
          <div className={style['product__base_info__brand']}>{brand}</div>
        <Link
          to={is_packUrl ? is_packUrl : cartitem_setUrl}
        >
          <div className={style['product__base_info__title']}>{title}</div>
        </Link>        
        <div className={style['product__base_info__size']}>Размер: {is_packSize ? is_packSize : size}</div>
          <div className={style['product__base_info__color']}>Цвет: {is_packColor ? is_packColor : color}</div>
          <div className={style['product__base_info__condition']}>
            Условие покупки:
            <span className={style['product__base_info__condition-content']}>
              <div>
                {condition}
              </div>
            </span>
          </div>
        </div>
      
        <Button
          onClick={() => {
            setStateAction({
              x: [20, -200],
              opacity: [.8, .6, .4, .2, 0]
            })
           deleteProductFromCart(id)
          }}
          className={style['product__delete-mobile']}
          gxVariant={'text'}
          size="sm"
          circle
        >
          <GxIcon src={closeRed} className={style['product__delete-mobile_icon']} />
        </Button>
      </div>
      {/* цена и скидки */}
      <div className={style['product__sales_info']}>
        <div className={style['product__sales_info-current_price']}>
          {is_packPrice ? is_packPrice : total_item_price} {currentCurrcensies}
        </div>
        {!hideSales ? (
          <div className={style['product__sales_info-wrapper-column']}>
            <div className={style['product__sales_info-terms']}>
              При заказе от 3 ед.
              <span className={style['product__sales_info-new_price']}>5 %</span>
            </div>
            <div className={style['product__sales_info-terms']}>
              При заказе от 5 ед.
              <span className={style['product__sales_info-new_price']}>10 %</span>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* счетчик и остатки */}
      <div className={style['product__inner']}>
        <div className={style['product__count-main']}>
          <div className={style['product__count']}>

            <motion.div
              initial={{ backgroundColor: "#fff" }}
              transition={{ duration: .2 }}
              whileTap={{ 
                backgroundColor: "#000"
              }}
            >
            <Button 
              onClick={decCounterProduct} 
              variant={'counter-btn'} 
              slot={'prefix'}
            >
              -
              </Button>
            </motion.div>
            <input  
              
              autoFocus
              onFocus={e => e.currentTarget.select()}
              type="text"
              className={style['product__count-input']}
              value={`${countProducts}`}
              onChange={(e) => { changeValueCounterProduct(e) }} 
            />
              <motion.div
                initial={{ backgroundColor: "#fff" }}
                whileTap={{ 
                  backgroundColor: "#000"
                }}
                transition={{ duration: .2 }}
              >                
                <Button
                  id={id}
                  disabled={countProducts === in_stock_count}
                  onClick={incCounterProduct} 
                  variant={'counter-btn'} 
                  slot={'suffix'}
                >
                  +
                </Button>
            </motion.div>
           
          </div>
          {in_stock_count ? (
              <div className={style['product__count-text']}>Осталось: {in_stock_count} шт.</div>
            ) : null}
        </div>
            {/* общая стоимость и удалить с карзикы */}
        <div className={style['product__wrapper-block_right']}>
        <div className={style['product__current_currency']}>
          {total_price} {currentCurrcensies}
        </div>

 
      </div>
      </div>
      <Button
        onClick={() => {
          setStateAction({
            x: [20, -200],
            opacity: [.8, .6, .4, .2, 0]
          })
          deleteProductFromCart(id)
        }}
        className={style['product__delete']}
        gxVariant={'text'}
      >
        <GxIcon slot={'icon-right'} src={closeJustIcon} />
      </Button>
    </motion.div>
  );
};

export default React.memo(Card);
