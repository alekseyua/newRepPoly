import React from 'react';
import { GxButton, GxIcon, GxTooltip } from '@garpix/garpix-web-components-react';
import classNames from 'classnames';
import style from '../styles/index.module.scss';
import {statusSend} from '../../../images';
import {v4} from 'uuid';


const OrderingDeliveryVariantsBtn = ({ deliveryVariant = [], setActiveVariantPayments, idEnableBtn }) => {
  return (
    <>
      <div className={style['ordering__button_wrap']}>
        {deliveryVariant.map((el) => {
          return (
          // <GxTooltip
          //   key={v4()}
          //   content="сдесь можно выбрать почтовую службу"
          //   placement="top-start"
          // >
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
              { idEnableBtn === el.id?
                <GxIcon
                  slot="icon-left"
                  src={statusSend}
                  className="cabinet_orders_details__base_info__icon"
                />
                :null
              }
            </GxButton>
          // </GxTooltip>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(OrderingDeliveryVariantsBtn);
