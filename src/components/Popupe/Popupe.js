import React, { useCallback, useState } from 'react';
import style from './popupe.module.scss';
import { motion } from 'framer-motion';
import { GxModal } from '@garpix/garpix-web-components-react';
import ModalContentViews from '../../Views/ModalContentViews';
import classNames from 'classnames';
import Text from '../Text';
import { v4 } from 'uuid';
import {defaultProductCard} from '../../images';

const Popupe = ({
  dataPopup,
  title,
  setShowPopapInfoColection,
  showPopapInfoColection,
  setIsOpen,
  closeModal,
  site_configuration,
  modalStates,
  styleModal,
  AsyncWorldStandardSizesChart, 
  AsyncLabels,
  AsyncPricesContainer,
  lables,
  pricesHook,
  role_configuration,
  currenssies,
  recommended_priceHook,
  in_cart_countHook,
}) => {
  const [classState, setClassState] = useState(new Set());
  const customImg = defaultProductCard;


  const sortCollection = (collections) => {

    let res = collections.items.sort((a, b) => (a.size.id > b.size.id) ? 1 : -1)
    res = res.map(el => {
      let result = el;
      result = {
        ...result,
        test: null
      }

      result = {
        ...result,
        test: classState
      }

      return result
    }
    )
    return res
  }
  const addOrRemoveEl = useCallback((el) => {
    setClassState((prev) => {
      if (prev.has(+el)) { // если есть - убираем
        prev.delete(+el);
      } else { // если нет - добавляем
        prev.clear()
        prev.add(+el);
      }
      return new Set(prev);
    });
  }, [classState]);



  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1,
        transition: { duration: .5 }
      }}
      className={style['popup']}
    >
      <button
        type="button"
        className={style['popup__close']}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(false)
          setShowPopapInfoColection({
            ...showPopapInfoColection,
            show: false,
            content: null,
          });
        }}
      >
        X
      </button>

      <motion.div
        initial={{
          scale: 0,
          perspective: 0,
          rotateX: 0
        }}
        animate={{
          scale: 1,
          transition: { duration: 1.5 },
        }}

        className={style['popup__container']}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(false)
          setShowPopapInfoColection({
            ...showPopapInfoColection,
            show: false,
            content: null,
          });
        }}
      >
        {/* <ModalContentViews.CloseBtn closeModal={closeModal} /> */}

        <GxModal
          onGx-after-hide={closeModal}
          open={modalStates.show}
          className={classNames({
            [styleModal['modal_creator']]: true,
            [styleModal['modal-how_to']]: true,
          })}
        >
          <ModalContentViews.ModalWrapper>
            <ModalContentViews.ContentBlock>
              <AsyncWorldStandardSizesChart
                site_configuration={site_configuration}
              />
            </ModalContentViews.ContentBlock>
          </ModalContentViews.ModalWrapper>
        </GxModal>
        <div className={style['popup__main']}>

          <ul
            className={style['popup__list']}
          >

            {dataPopup.map((collections, index) => {
              let res = dataPopup[index].items.map(redeemed => redeemed.redeemed)
              let enableBtn = res.filter(item => item === false ? true : false)
              let colec = sortCollection(collections)
              console.log(`collections?.items[0]?.size?.image`,collections)

              return (
                <li
                  key={collections.id}
                  className={style['popup__item']}

                >
                  <div className={style['item-title__text']}>
                    <h1>
                      Сбор <strong>{index + 1}</strong>
                    </h1>
                    <h3 className={style['item-title__text-title']}>{title}</h3>
                  </div>

                  <div className={style['popup__body-collectiion body-collectiion']}>
                    <div className={style['popup__item-title item-title-body']}>
                      <div className={style['popup__item-title']}>
                        <div className={style['item-title__badge']}>
                          <AsyncLabels items={lables} />
                        </div>
                        <div className={style['item-title__image']}>
                          <div style={{ backgroundImage: `url(${collections?.items[0]?.size?.image?collections.items[0]?.size?.image:customImg})` }} className={style['popup__image']} />
                        </div>
                      </div>
                      <div className={style['item-title__main-price']}>
                        <AsyncPricesContainer
                          prices={pricesHook}
                          role_configuration={role_configuration}
                          currenssies={currenssies}
                          recommended_price={recommended_priceHook}
                          in_cart_count={in_cart_countHook}
                        />
                      </div>
                      <div className={style['prodpage-colors']}>
                        <div className={style['prodpage-colors__name']}>
                          <span>
                            <Text text="color" />: &nbsp;
                          </span>
                          {collections?.items[0]?.size?.color_name}
                          <div
                            className={style['body-collectiion__condition']}
                            style={{
                              width: '20px',
                              height: '20px',
                              margin: '5px 0',
                              border: '1px solid #000',
                              borderRadius: '2px',
                              backgroundColor: collections?.items[0]?.size?.color,
                            }}
                          >.</div>
                        </div>
                      </div>
                      <div className={style['body-collectiion__goods']}>
                        <div className={style['body-collection__size']}>
                          <ul
                            className={style['prodpage-sizes__items']}
                          >
                            {colec.map((el, i) => {

                              return (
                                <li
                                  key={v4(i * 2)}
                                  className={style['prodpage-sizes__itemPopupe']}
                                >
                                  <button
                                    key={v4(i)}
                                    disabled={classState.has(collections.id + (el.size.id + index * 444)) ? '' : el.redeemed}
                                    type="button"
                                    id={collections.id + (el.size.id + index * 444)}
                                    style={el.test.has(collections.id + (el.size.id + index * 444)) ? { background: 'rgb(0, 0, 0)', color:'rgb(255,255,255)' } : null}
                                    onClick={(e) => {
                                      addOrRemoveEl(e.target.id)
                                    }}
                                    className={style['prodpage-sizes__size-buttonPopupe']}
                                  >
                                    {el.size.title}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>

                        </div>
                      </div>
                    </div>
                   
                </div>
                </li>
          )
            }
            )}
        </ul>
      </div>
    </motion.div>
    </motion.div >
  );
};

export default Popupe;
