import { GxIcon } from '@garpix/garpix-web-components-react';
import { useStoreon } from 'storeon/react';
import ProductPrice from '../../components/ProductPrice';
import { sliderArrowLeft } from '../../images';
import style from './style.module.scss';

const SearchResult = ({ item,role }) => {
  const {dispatch} = useStoreon()
  console.log('item',item)
  const { title, images, prices, id, url, article } = item;
  const goToUrl = (e) => {

    const params = {
      role: role,
      id: id,
      url: url,
    }
    dispatch('getProductDetailsModal',params)
  }

  return (
    <button onClick={goToUrl} className={style['search-result']}>
      <div className={style['search-result__info']}>
        <h4 className={style['search-result__title']}>{title} {article}</h4>
        <ProductPrice price={prices.price} />
      </div>
      <div className={style['search-result__images']}>
        <img className={style['search-result__preview']} src={images[0]} />
        <GxIcon src={sliderArrowLeft} className={style['search-result__arrow']} />
      </div>
    </button>
  );
};
export default React.memo(SearchResult);
