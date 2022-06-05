import React from 'react';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import classNames from 'classnames';
import style from '../styles/index.module.scss';
import { ROLE } from '../../../const';
import Icon from '../../../#lifehack/Icomoon/Icon';
import {statusSend} from '../../../images';
const OrderingPayButtons = ({ payment_methods = [], setActiveVariantPayments,dataBalance,total_cost }) => {

  if (payment_methods.length) {
    return (
      <div className={style['ordering__button_wrap']}>
        {payment_methods.map((el,i) => {
          if (dataBalance >= total_cost){
            if(el.id!==1){
            return (

              <GxButton
                variant="text"
                key={el.id}
                id={el.id}
                onClick={setActiveVariantPayments}
                className={classNames({
                  [style['ordering__button']]: true,
                  [style[`ordering__button--${i}`]]: true,
                  [style['ordering__button-active']]: el.active,
                })}
              >
                {el.title}
                
                { !el.active?
                  // <>
                  //     <span></span>
                  //     <span></span>
                  //     <span></span>
                  //     <span></span>
                  // </>
                  null
                  : <GxIcon
                  slot="icon-left"
                  src={statusSend}
                  className="cabinet_orders_details__base_info__icon"
                />
              }
                </GxButton>
            );}
          }else{
            if(el.id!==3){
              return (
                <GxButton
                  variant="text"
                  key={el.id}
                  id={el.id}
                  onClick={setActiveVariantPayments}
                  className={classNames({
                    [style['ordering__button']]: true,
                    [style['ordering__button-active']]: el.active,
                  })}
                >
                  {el.title}
                  { !el.active?
                  // <>
                  //     <span></span>
                  //     <span></span>
                  //     <span></span>
                  //     <span></span>
                  // </>
                  null
                  : <GxIcon
                  slot="icon-left"
                  src={statusSend}
                  className="cabinet_orders_details__base_info__icon"
                />
              }
                </GxButton>
              );
            }
          }

        })}
      </div>
    );
  } else {
    return null;
  }
};

export default React.memo(OrderingPayButtons);
