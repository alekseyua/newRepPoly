import React from 'react';
import { GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import classNames from 'classnames';
import style from '../styles/index.module.scss';
import {statusSend} from '../../../images';


const OrderingDeliveryVariantsBtn = ({ deliveryVariant = [], setActiveVariantPayments, idEnableBtn }) => {
  return (
    <>
      <div className={style['ordering__button_wrap']}>
        {deliveryVariant.map((el) => {
          return (
            <GxButton
              key={el.id}
              id={el.id}
              onClick={setActiveVariantPayments}
              variant="text"
              className={classNames({
                [style['ordering__button']]: true,
                [style['ordering__button-active']]: el.active,
              })}
            >
              {el.title}
              {/* { true?
                  <>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                  </>
                  : <GxIcon
                  slot="icon-left"
                  src={statusSend}
                  className="cabinet_orders_details__base_info__icon"
                />
              } */}
              { idEnableBtn === el.id?
                <GxIcon
                  slot="icon-left"
                  src={statusSend}
                  className="cabinet_orders_details__base_info__icon"
                />
                :null
              }
            </GxButton>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(OrderingDeliveryVariantsBtn);
