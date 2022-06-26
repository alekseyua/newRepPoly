import React from 'react';
import { ROLE } from '../../../const';
import classNames from 'classnames';
import style from '../styles/index.module.scss';
import { useStoreon } from 'storeon/react';

const PriceContainer = ({
  prices = {},
  recommended_price,
  in_cart_count,
}) => {
  const { more_3_item_price, more_5_item_price, old_price, price } = prices;
  const { userPage } = useStoreon('userPage');
  let { currenssies } = useStoreon('currenssies');
  const { role } = userPage.profile;

  if (currenssies) {
    currenssies = currenssies.toUpperCase();
  }



  return (
    <div className={style['prodpage-price-container']}>
      <p
        className={classNames({
          [style['prodpage-price-container__mainprice']]: true,
          sceleton: !price,
          min_block: !price,
        })}
      >
        {price ? (
          <> {role === ROLE.RETAIL
              ?(<>
                {in_cart_count>=5
                ?more_5_item_price
                :in_cart_count>=3
                  ?more_3_item_price
                  :(<>
                  {price}&nbsp;
                  </>)
                }
                {(in_cart_count>=3) ? (
                  <span className={style['prodpage-price-container__mainprice-old']}>{price}</span>
                ) : null}
                &nbsp;
                {currenssies}
             </> )
            :<span >{price}&nbsp;
            {currenssies}</span>}
          </>
        ) : null}
      </p>
      <div className={style['prodpage-price-container__varpricecontainer']}>
        {role !== ROLE.RETAIL && recommended_price ? (
          <>
            <p>Рекомендуемая розничная цена:</p>
            <p>
              <span>
                {recommended_price} {currenssies}
              </span>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(PriceContainer);
