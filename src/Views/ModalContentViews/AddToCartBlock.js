import React from 'react';
import HeaderBlock from './HeaderBlock';
import { categoryCard1 } from '../../images';
import { useStoreon } from 'storeon/react';
import Button from '../Button';
import style from './styles/index.module.scss';
import { useHistory } from 'react-router';
import { ROLE } from '../../const';

const AddToCartBlock = ({
  title = 'Свитер такой-то',
  image = categoryCard1,
  size = 'ИДЕА́ЛЬНЫЙ',
  allPrice = false,
  currentPrice = false,
  handleClose,
  product_rcHook,
  product_rcAmount = 1, 
  is_collection,
}) => {

  const { dispatch, currenssies, stateCountRestart } = useStoreon('currenssies', 'stateCountRestart'); //currenssies
  const { userPage }    = useStoreon('userPage');
  const history         = useHistory();
  const { role, user, status }        = userPage.profile;

  const handlerGoToCart = ()=>{
    handleClose()
    dispatch('stateCountRestart/add',!stateCountRestart)
    let params = {};
    if (status === 1){
    if (user.checkEmail){
      params = {
        path: null,
        success: 'Администратор проверяет введенные Вами данные. Что бы воспользоваться всеми возможностями сотрудничества, дождитесь обновления статуса или свяжитесь с нами через форму "Обратная связи"',
        fail: null,
      }
    }else{
      params = {
        path: null,
        success: null,
        fail: 'Что бы воспользоваться всеми возможностями сотрудничества, подтвердите почту и дождитесь проверки администратора',
      }
    }
    dispatch('warrning/set', params)
    } else if(status === 0){
      params = {
        path: 'authorization',
        success: null,
        fail: 'Что бы воспользоваться всеми возможностями сотрудничества, необходимо зарегистрироваться',
      }
      dispatch('warrning/set', params)
    }else if(status === 2){
      params = {
        path: 'registration',
        success: null,
        fail: 'Вам отказано в регистрации, пользование сайтом ограничено',
      }
      dispatch('warrning/set', params)
    }else{
      history.push('cart');
    }

  }

  return (
    <div className={style['add_to_cart-wrapper']}>
      <HeaderBlock title={'Добавлено в корзину'} mb={20} />
      <div className={style['add_to_cart-wrapper-content']}>
        <div className={style['add_to_cart-wrapper-content-wrapper']}>
          <img
            className={style['add_to_cart-wrapper-content--image']}
            width="120px"
            height="120px"
            src={image}
            alt="review"
          />
          <div className={style['add_to_cart-wrapper-content--description']}>
            <span>{title}</span>
            {
            role === ROLE.RETAIL || role === ROLE.DROPSHIPPER?
            <span>{size}</span>
                :(
                <>
                <span>{product_rcHook}</span>                  
                </>
                )
            }
          </div>
        </div>
        <div className={style['add_to_cart-wrapper-content--currency_desc']}>
          {allPrice ? (
            <div className={style['add_to_cart-wrapper-content--price-sell']}>
              {allPrice.toFixed(2)} {currenssies}
            </div>
            ) : null
          }
          
          {currentPrice ? (
            <span className={style['add_to_cart-wrapper-content--price']}>
              {currentPrice.toFixed(2)} {currenssies}
            </span>
          ) : null
          }
          {role === ROLE.WHOLESALE && is_collection?
            <div className={style['add_to_cart-wrapper-content--price']}>{(currentPrice * product_rcAmount).toFixed(2)} {currenssies}</div>
            : null
          }
         
        </div>
      </div>
      
        <div className={style['add_to_cart-wrapper-buttons']}>
          <Button variant="catalog-link-transparent-min" onClick={handleClose}>
            продолжить покупки
          </Button>
          <Button variant="cancel-black-min" onClick={handlerGoToCart}>
            перейти в корзину
          </Button> 
        </div>
    </div>
  );
};

export default React.memo(AddToCartBlock);
