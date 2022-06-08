import React, { useState, useEffect } from 'react';
import Container from '../../Views/Container';
import { productCard1, productCard2, productCard3 } from '../../images';
import { FetcherList, dataStates } from '@garpix/fetcher';
import WishlistViews from '../../Views/WishlistViews';
import Pagination from '../../Views/Pagination';
import ProductCard from '../../components/ProductCard';
import qs from 'query-string';
import Title from '../../Views/Title';
import Text from '../../components/Text';
import Breadcrumbs from '../../Views/Breadcrumbs';
import api from '../../api';
import { ROLE, LOCAL_STORAGE_KEYS } from '../../const';
import AsyncComponent from '../AsyncComponent';
import { useStoreon } from 'storeon/react';

const AsyncYouHaveAlreadyWatched = AsyncComponent(() => {
  return import('../YouHaveAlreadyWatched');
});

const apiProfile = api.profileApi;
const apiContent = api.contentApi;
const defaultImageSet = [productCard1, productCard2, productCard3];

const WishlistComponent = ({ breadcrumbs, initfilters, page_type_catalog }) => {
  const { stateCountWish, dispatch } = useStoreon('stateCountWish');
  const { userPage } = useStoreon('userPage');

  const [wishlistAlCount, setWishlistAlCount] = useState(0)
  const [listMyWish, setListMyWish] = useState([]);
  const { updateCurrenssies } = useStoreon('updateCurrenssies');

  const { role } = userPage.profile;

  useEffect(() => {
    apiProfile
      .getWishlist()
      .then((res) => {
        res.results
          ? setListMyWish(res.results)
          : setListMyWish([]);
        dispatch('stateCountWish/add', res);
      })
      .catch((err) => {
        console.log('ERROR getWishList');
      })
    stateCountWish.results
      ? setWishlistAlCount(stateCountWish.count)
      : setListMyWish(0);
  }, [stateCountWish.count, updateCurrenssies])


  return (
    <FetcherList
      isScrollTop={true}
      initFilter={initfilters}
      api={ROLE.UNREGISTRED === role ? apiContent.getProductByIds : apiProfile.getWishlist}
    >
      {(data) => {
        const {
          count,
          results = [],
          activePage,
          loadData,
          showMore,
          status,
          filterParams,
          deleteElement,
          updateElement,
          deleteElementByKey,
          updateElementByKey,
          isNext,
          isPrev,
        } = data;

        return (
          <WishlistViews.Wrapper>
            <Container>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <React.Fragment>
                <Title variant={'wishlist'} type={'h1'}>
                  {listMyWish.length ? (
                    <Text text={'favorits.product'} />
                  ) : (
                    <Text text={'favorits.product.not.find'} />
                  )}
                </Title>
                {listMyWish.length ? (
                  <WishlistViews.CountProduct>{wishlistAlCount} товаров (-a)</WishlistViews.CountProduct>
                ) : null}
                {listMyWish.length ? (
                  <React.Fragment>
                    <WishlistViews.LayoutProduct>
                      {listMyWish.map((el) => {
                        const data = el.product ? el.product : el;
                        return (
                          <ProductCard
                            {...data}
                            update={() => {
                              loadData(1, filterParams);
                            }}
                            url={data.url}
                            key={data.id}
                            title={data.title}
                            id={data.id}
                            brand={data.brand}
                            favorite={data.is_liked}
                            prices={data.prices}
                            stock={data.stock}
                            colors={data.colors}
                            images={data.images.length ? data.images : defaultImageSet}
                            isSales={data.is_closeout}
                            isNew={data.is_new}
                            isHit={data.is_bestseller}
                            sizes={data.sizes}
                            product_rc={data.product_rc}
                            profile={data.profile}
                          />
                        );
                      })}
                    </WishlistViews.LayoutProduct>
                    <Pagination
                      addClass={'left'}
                      activePage={activePage}
                      count={count}
                      params={filterParams}
                    />
                  </React.Fragment>
                ) : (
                  <WishlistViews.Wrapper>
                    <WishlistViews.HelpText>
                        Все товары, отмеченные сердечком, появятся на этой странице. Добавляйте в избранное, 
                        чтобы быстро вернуться к самым интересным моделям и не забыть заказать
                    </WishlistViews.HelpText>
                    <WishlistViews.LinkCatalog to={page_type_catalog}>
                        СМОТРЕТЬ ТОВАРЫ
                    </WishlistViews.LinkCatalog>
                  </WishlistViews.Wrapper>
                )}
              </React.Fragment>
            </Container>

            <WishlistViews.RecomendWrapper>
              <AsyncYouHaveAlreadyWatched />
            </WishlistViews.RecomendWrapper>
          </WishlistViews.Wrapper>
        );
      }}
    </FetcherList>
  );
};

export default React.memo(WishlistComponent);
