import React, { useState } from 'react';
import Layout from '../Views';
import Modal from '../Views/ModalCreator';
import PersonalPageViews from '../Views/PersonalPageViews';
import style from '../styles/components/personalPage/index.scss';
import PersonalPageComponent from '../components/PersonalPageComponent';
import ProductCard from '../components/ProductCard';
import Title from '../Views/Title';
import CartViews from '../Views/CartViews';
import Text from '../components/Text';
import { useStoreon } from 'storeon/react';
import {
  addressIcon,
  wallet,
  truck,
  statusWait,
  toolTipIcon,
  btnDown,
  productCard1,
  change,
  bougth,
  paperclip,
  send,
} from '../images';
import {
  GxButton,
  GxForm,
  GxIcon,
  GxInput,
  GxMenuItem,
  GxSelect,
} from '@garpix/garpix-web-components-react';

const initialCartData = {
  cartitem_set: [],
  id: 8,
};
const OrderDetailsMarket = (props) => {
  const {
    header_menu,
    product,
    cabinet_menu,
    create_shop,
    cabinet_site_menu,
    profile_data,
    profile,
  } = props;
  const { currenssies } = useStoreon('currenssies'); //currenssies
  const currentCurrcensies = String(currenssies).toUpperCase();
  const { user = {}, shop, role, passport, organization, links, id, balance } = profile;
  const { is_has_shop, shop_link } = shop;
  const { username } = user;
  const [cartData, setCartData] = useState(initialCartData);
  return (
    <Layout responsive {...props}>
      <Modal.ModalCreator {...modalStates} setModalStates={setModalStates} />
      <Modal.StorControllerModal />
      <PersonalPageViews.WrapperPage
        leftChildComponent={
          <PersonalPageComponent.SidebarEntryPersonalPage
            shop={shop}
            create_shop={shop_link}
            is_has_shop={is_has_shop}
            cabinet_menu={cabinet_menu}
            cabinet_site_menu={cabinet_site_menu}
            balance={balance}
            username={username}
            role={role}
            setModalStates={setModalStates}
          />
        }
        rightChildComponent={
          <>
            <div className="cabinet_mobile_wrapper">
              <h1 className="cabinet_orders_details__title">
                ?????????? ??? 20201120-FTN33-210-955687
                <span className="cabinet_orders_details__date">???? 20.11.2020</span>
              </h1>

              <div className="cabinet_orders_details__ordercard">
                <div className="cabinet_orders_details__wrapper">
                  <div className="cabinet_orders_details__leftside">
                    <div className="cabinet_orders_details__edit">
                      <GxSelect
                        label="???????????? ????????????"
                        className="cabinet_orders_details__edit_status"
                      >
                        <GxMenuItem value="option-1"></GxMenuItem>
                      </GxSelect>
                      <GxInput
                        label="????????-?????????? ?????? ????????????????????????"
                        className="cabinet_orders_details__edit_track"
                      />
                    </div>
                    <div className="cabinet_orders_details__middle">
                      <div className="cabinet_orders_details__pay">
                        <GxIcon src={wallet} className="cabinet_orders_details__icon" />
                        ???????????? ????????????
                      </div>
                      <div className="cabinet_orders_details__delivery">
                        <GxIcon src={truck} className="cabinet_orders_details__icon" />
                        ???????? ????????????
                      </div>
                    </div>
                    <div className="cabinet_orders_details__address">
                      <GxIcon src={addressIcon} alt="address" class="cabinet-address__icon" />
                      <div class="cabinet-address__desc">
                        <div class="cabinet-address__value">
                          ???????????????????? ??????????????????, 153045 <br />
                          ??. ????????????, ??. ??????????????????????, ??. 145, ??????. 1, ??.2
                        </div>
                        <div class="cabinet-address__name">?????????????????? ???????? ??????????????????</div>
                        <div class="cabinet-address__phone">+79204525366</div>
                      </div>
                    </div>
                  </div>
                  <div className="cabinet_orders_details__rightside">
                    <GxButton variant="text" className="cabinet_orders_details__cancel">
                      ???????????????? ??????????
                    </GxButton>

                    <CartViews.BlockRightSide>
                      <CartViews.Text type={'text-default'}>
                        <Text text={'order.cost'} />
                      </CartViews.Text>
                      <CartViews.Text type={'text-default_currency'}>
                        500 ZL
                        {/* 980 {currentCurrcensies} */}
                      </CartViews.Text>
                    </CartViews.BlockRightSide>
                    <CartViews.BlockRightSide>
                      <CartViews.Text type={'text-default'}>
                        ???????????? ???? ??????????????????:
                        {/* <Text text={'sale'} /> */}
                      </CartViews.Text>
                      <CartViews.Text type={'text-red'}>800 ZL</CartViews.Text>
                    </CartViews.BlockRightSide>
                    <CartViews.BlockRightSide>
                      <CartViews.Text type={'text-default'}>
                        <Text text={'shipping'} />
                      </CartViews.Text>
                      <CartViews.Text type={'text-default_currency'}>
                        400 ZL
                        {/* 130 {currentCurrcensies} */}
                      </CartViews.Text>
                    </CartViews.BlockRightSide>
                    <CartViews.Line />
                    <CartViews.BlockRightSide mb={20}>
                      <CartViews.Text type={'text-title'}>
                        {/* <Text text={'total.payable'} />: */}
                        ??????????:
                      </CartViews.Text>
                      <CartViews.Text type={'text-title'}>
                        {' '}
                        200 ZL
                        {/* {cartData.total ?? 0} {currentCurrcensies} */}
                      </CartViews.Text>
                    </CartViews.BlockRightSide>
                  </div>
                </div>

                <div className="cabinet_orders_details__comment">
                  <div className="cabinet_orders_details__commentleft">??????????????????????:</div>
                  <div className="cabinet_orders_details__commentright">
                    ???? ???????????????? ??????, ?????? ???? ?????????????? ?????? ???????????? ??????????, ?? ?????????? ???????? ???? ???????????? ????
                    ???????????? ???????? ????????????. ?????? ?????????? ???? ???????????????? ??????-????, ???????????? ?????? ???????? ???????????? ?? ????????
                    ?????????? ???????????????????????? ??????
                  </div>
                </div>
              </div>

              <div className="cabinet_orders_details__listhead">
                <div className="cabinet_orders_details__listtitle">?????????????? ?? ???????????? (8)</div>

                <GxButton
                  variant="text"
                  download
                  size="sm"
                  className="linkblue cabinet_orders_details__listlink"
                >
                  <GxIcon slot="icon-left" src={btnDown} />
                  ?????????????? ????????????????????????
                </GxButton>
              </div>

              <div className="cabinet_orders_details__listwrapper">
                <div className="cabinet_orders_details__listleft">
                  <div className="cabinet_orders_details__listsubhead">
                    ????????????, ???????????????????? ????????????:{' '}
                    <span className="cabinet_orders_details__listsubhead-red">4</span>
                  </div>
                  <div className="cabinet_orders_details__card">
                    <div className="cabinet_orders_details__wrapper-block">
                      <img src={productCard1} className="cabinet_orders_details__image_thumb" />
                      <div className="cabinet_orders_details__base_info">
                        <div className="cabinet_orders_details__base_info__brand">NAME BRAND</div>
                        <div className="cabinet_orders_details__base_info__title">
                          ???????????? ??????????-????
                        </div>
                        <div className="cabinet_orders_details__base_info__wrapper">
                          <div className="cabinet_orders_details__base_info__col">
                            <div className="cabinet_orders_details__base_info__desc">
                              <Text text={'size'} />:{' '}
                              <span className="cabinet_orders_details__base_info__desc-black">
                                S
                              </span>
                            </div>
                            <div className="cabinet_orders_details__base_info__desc">
                              <Text text={'color'} />:{' '}
                              <span className="cabinet_orders_details__base_info__desc-black">
                                ????????????????-??????????????
                              </span>
                            </div>
                            <div className="cabinet_orders_details__base_info__desc">
                              ????????????:{' '}
                              <span className="cabinet_orders_details__base_info__desc-black">
                                ??????????????????
                              </span>
                            </div>
                          </div>
                          <div className="cabinet_orders_details__base_info__col">
                            <div className="cabinet_orders_details__base_info__desc">
                              ??????-????:{' '}
                              <span className="cabinet_orders_details__base_info__desc-black">
                                1 ????.
                              </span>
                            </div>
                            <div className="cabinet_orders_details__base_info__desc">
                              ????????:{' '}
                              <span className="cabinet_orders_details__base_info__desc-red">
                                90 zl{' '}
                              </span>
                              <span className="cabinet_orders_details__base_info__desc-black">
                                (45 ZL/????.)
                              </span>
                            </div>
                            <div className="cabinet_orders_details__base_info__desc">
                              <GxSelect
                                size="sm"
                                placeholder="???????????? ????????????"
                                className="cabinet_orders_details__status_dropdown"
                              >
                                <GxMenuItem
                                  value="option-1"
                                  className="cabinet_orders_details__status_item"
                                >
                                  ????????????????
                                </GxMenuItem>
                                <GxMenuItem
                                  value="option-2"
                                  className="cabinet_orders_details__status_item"
                                >
                                  ????????????
                                </GxMenuItem>
                                <GxMenuItem
                                  value="option-3"
                                  className="cabinet_orders_details__status_item"
                                >
                                  ??????????????????
                                </GxMenuItem>
                                <GxMenuItem
                                  value="option-4"
                                  className="cabinet_orders_details__status_item"
                                >
                                  ????????????????
                                </GxMenuItem>
                              </GxSelect>
                            </div>
                          </div>
                        </div>
                        <div className="cabinet_orders_details__base_info__desc">
                          ??????????????????????:{' '}
                          <span className="cabinet_orders_details__base_info__desc-black">
                            ??????????-???? ?????????? ?? ?????????????????? ?????????? ???????????????? ?????????? ??????????-???? ?????????? ??
                            ?????????????????? ?????????? ???????????????? ??????????
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Card end */}

                  <div className="cabinet_orders_details__listsubhead">
                    ????????????: <span className="cabinet_orders_details__listsubhead-black">4</span>
                  </div>

                  <div className="cabinet_orders_details__dropwrapper">
                    {' '}
                    {/* ?????????????? ?????? ???????? ????????/?????? */}
                    <div className="cabinet_orders_details__brandname">NAME BRAND ???1</div>
                    <div className="cabinet_orders_details__card">
                      <div className="cabinet_orders_details__wrapper-block">
                        <img src={productCard1} className="cabinet_orders_details__image_thumb" />
                        <div className="cabinet_orders_details__base_info">
                          <div className="cabinet_orders_details__base_info__brand">NAME BRAND</div>
                          <div className="cabinet_orders_details__base_info__title">
                            ???????????? ??????????-????
                          </div>
                          <div className="cabinet_orders_details__base_info__wrapper">
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'size'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  S
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'color'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ????????????????-??????????????
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ??????????????????
                                </span>
                              </div>
                            </div>
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                ??????-????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  1 ????.
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-red">
                                  90 zl{' '}
                                </span>
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  (45 ZL/????.)
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <GxSelect
                                  size="sm"
                                  placeholder="???????????? ????????????"
                                  className="cabinet_orders_details__status_dropdown"
                                >
                                  <GxMenuItem
                                    value="option-1"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-2"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-3"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ??????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-4"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                </GxSelect>
                              </div>
                            </div>
                          </div>
                          <div className="cabinet_orders_details__base_info__desc">
                            ??????????????????????:{' '}
                            <span className="cabinet_orders_details__base_info__desc-black">
                              ??????????-???? ?????????? ?? ?????????????????? ?????????? ???????????????? ?????????? ??????????-???? ?????????? ??
                              ?????????????????? ?????????? ???????????????? ??????????
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Card end */}
                    <div className="cabinet_orders_details__brandname">NAME BRAND ???2</div>
                    <div className="cabinet_orders_details__card">
                      <div className="cabinet_orders_details__wrapper-block">
                        <img src={productCard1} className="cabinet_orders_details__image_thumb" />
                        <div className="cabinet_orders_details__base_info">
                          <div className="cabinet_orders_details__base_info__brand">NAME BRAND</div>
                          <div className="cabinet_orders_details__base_info__title">
                            ???????????? ??????????-????
                          </div>
                          <div className="cabinet_orders_details__base_info__wrapper">
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'size'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  S
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'color'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ????????????????-??????????????
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ??????????????????
                                </span>
                              </div>
                            </div>
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                ??????-????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  1 ????.
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-red">
                                  90 zl{' '}
                                </span>
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  (45 ZL/????.)
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <GxSelect
                                  size="sm"
                                  placeholder="???????????? ????????????"
                                  className="cabinet_orders_details__status_dropdown"
                                >
                                  <GxMenuItem
                                    value="option-1"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-2"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-3"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ??????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-4"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                </GxSelect>
                              </div>
                            </div>
                          </div>
                          <div className="cabinet_orders_details__base_info__desc">
                            ??????????????????????:{' '}
                            <span className="cabinet_orders_details__base_info__desc-black">
                              ??????????-???? ?????????? ?? ?????????????????? ?????????? ???????????????? ?????????? ??????????-???? ?????????? ??
                              ?????????????????? ?????????? ???????????????? ??????????
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Card end */}
                    <div className="cabinet_orders_details__card">
                      <div className="cabinet_orders_details__wrapper-block">
                        <img src={productCard1} className="cabinet_orders_details__image_thumb" />
                        <div className="cabinet_orders_details__base_info">
                          <div className="cabinet_orders_details__base_info__brand">NAME BRAND</div>
                          <div className="cabinet_orders_details__base_info__title">
                            ???????????? ??????????-????
                          </div>
                          <div className="cabinet_orders_details__base_info__wrapper">
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'size'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  S
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <Text text={'color'} />:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ????????????????-??????????????
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  ??????????????????
                                </span>
                              </div>
                            </div>
                            <div className="cabinet_orders_details__base_info__col">
                              <div className="cabinet_orders_details__base_info__desc">
                                ??????-????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  1 ????.
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                ????????:{' '}
                                <span className="cabinet_orders_details__base_info__desc-red">
                                  90 zl{' '}
                                </span>
                                <span className="cabinet_orders_details__base_info__desc-black">
                                  (45 ZL/????.)
                                </span>
                              </div>
                              <div className="cabinet_orders_details__base_info__desc">
                                <GxSelect
                                  size="sm"
                                  placeholder="???????????? ????????????"
                                  className="cabinet_orders_details__status_dropdown"
                                >
                                  <GxMenuItem
                                    value="option-1"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-2"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-3"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ??????????????????
                                  </GxMenuItem>
                                  <GxMenuItem
                                    value="option-4"
                                    className="cabinet_orders_details__status_item"
                                  >
                                    ????????????????
                                  </GxMenuItem>
                                </GxSelect>
                              </div>
                            </div>
                          </div>
                          <div className="cabinet_orders_details__base_info__desc">
                            ??????????????????????:{' '}
                            <span className="cabinet_orders_details__base_info__desc-black">
                              ??????????-???? ?????????? ?? ?????????????????? ?????????? ???????????????? ?????????? ??????????-???? ?????????? ??
                              ?????????????????? ?????????? ???????????????? ??????????
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Card end */}
                  </div>

                  {/* ???????????? END */}
                </div>
                <div className="cabinet_orders_details__listright">
                  <div className="cabinet_orders_details__chat">
                    <div className="cabinet_orders_details__chat_head">
                      ?????? ???? ????????????
                      <div className="cabinet_orders_details__chat_mobbtn">???</div>
                    </div>
                    <div className="cabinet_orders_details__chat_field">
                      <div className="cabinet_orders_details__chatmessage cabinet_orders_details__chatmessage-usermarket">
                        <div className="cabinet_orders_details__chatmessage_wrapper">
                          <div className="cabinet_orders_details__chatmessage_name">Kissa1994</div>
                          <div className="cabinet_orders_details__chatmessage_date">
                            12.02.20 14:55
                          </div>
                        </div>
                        <div className="cabinet_orders_details__chatmessage_text">
                          ???????????????????? ?????????? ?????????????? ?????? ???????? ?? ?????????????? ?? ?????????? ???????????????? ????????????????????
                          ?????????? ?????????????? ?????? ???????? ?? ?????????????? ?? ?????????? ???????????????? ???????????????????? ?????????? ??????????????
                          ?????? ???????? ?? ?????????????? ?? ?????????? ????????????????
                        </div>
                        <div className="cabinet_orders_details__attach_wrapper">
                          {/* ?????????????? ?????? ???????????????? */}
                        </div>
                      </div>

                      <div className="cabinet_orders_details__chatmessage cabinet_orders_details__chatmessage-adminmarket">
                        <div className="cabinet_orders_details__chatmessage_wrapper">
                          <div className="cabinet_orders_details__chatmessage_name">????</div>
                          <div className="cabinet_orders_details__chatmessage_date">
                            12.02.20 14:55
                          </div>
                        </div>
                        <div className="cabinet_orders_details__chatmessage_text">
                          ???????????? ????????????
                        </div>
                        <div className="cabinet_orders_details__attach_wrapper">
                          {/* ?????????????? ?????? ???????????????? */}
                        </div>
                      </div>
                    </div>
                    <div className="cabinet_orders_details__chat_send">
                      <div className="cabinet_orders_details__chat_send_form">
                        <GxInput
                          className="cabinet_orders_details__chat_send_input"
                          placeholder="???????????????? ??????????????????..."
                        ></GxInput>
                        <GxButton
                          size="sm"
                          className="cabinet_orders_details__chat_send_attachbtn 
                    cabinet_orders_details__chat_send_btn"
                        >
                          <GxIcon src={paperclip} />
                        </GxButton>
                        <GxButton
                          size="sm"
                          className="cabinet_orders_details__chat_send_sendbtn 
                    cabinet_orders_details__chat_send_btn"
                        >
                          <GxIcon src={send} />
                        </GxButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      ></PersonalPageViews.WrapperPage>
    </Layout>
  );
};

export default React.memo(OrderDetailsMarket);
