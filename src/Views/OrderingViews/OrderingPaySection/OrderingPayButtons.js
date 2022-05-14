import React from 'react';
import { GxButton } from '@garpix/garpix-web-components-react';
import classNames from 'classnames';
import style from '../styles/index.module.scss';
import { ROLE } from '../../../const';

const OrderingPayButtons = ({ payment_methods = [], setActiveVariantPayments,dataBalance,total_cost }) => {

  if (payment_methods.length) {
    return (
      <div className={style['ordering__button_wrap']}>
        {payment_methods.map((el) => {
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
                  [style['ordering__button-active']]: el.active,
                })}
              >
                {el.title}
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
