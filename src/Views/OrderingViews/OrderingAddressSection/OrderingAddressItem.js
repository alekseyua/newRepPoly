import React from 'react';
import { GxButton, GxIcon, GxRadio, GxTooltip } from '@garpix/garpix-web-components-react';
import style from '../styles/index.module.scss';
import {statusSend} from '../../../images';

const OrderingAddressItem = ({
  city,
  country,
  first_name,
  flat,
  house,
  id,
  last_name,
  middle_name,
  phone,
  post_code,
  profile,
  street,
  selectedAdress,
  setFieldValue,
  setFieldCountry,
  handleChange,
  setStateMarquee,
  stateMarquee,
}) => {

  return (
    // <GxTooltip 
    //   content="сдесь можно выбрать адрес доставки"
    //   placement="top-start"
    // >
      <GxRadio
        // checked={selectedAdress === id ? true : null}
        id={id}
        onClick={(e) => {
          setStateMarquee(false)
          setFieldValue('selectedAdress', id);
          setFieldCountry(country);
          handleChange(country)
        }}
        name="address"
        className={style['ordering_address__card']}
      >
        <p className={style['ordering_address__card_address']}>
          {country}, {post_code}, {city}, {street}, {house}, {flat}
        </p>
        <p className={style['ordering_address__card_client']}>
          {last_name} {first_name} {middle_name}, {phone}
        </p>
        { selectedAdress === id?
          <GxIcon
            slot="icon-left"
            src={statusSend}
            className="cabinet_orders_details__base_info__icon"
          />
          :null
        }
      </GxRadio>
    // </GxTooltip>
  );
};

export default React.memo(OrderingAddressItem);
