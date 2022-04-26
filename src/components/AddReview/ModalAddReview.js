import React, { useState } from 'react';
import { GxTextarea, GxForm } from '@garpix/garpix-web-components-react';
import ModalContentViews from '../../Views/ModalContentViews';
import api from '../../api';
import { Formik } from 'formik';
import { Captcha } from '../Captha';
import { ERROR_STATUS } from '../../const';
import { Link } from 'react-router-dom';
import style from '../AddReview/style.module.scss';

const apiContent = api.contentApi;

const ModalAddReview = ({ product, profile, closeModal, openModalFinalyAddReview }) => {
  const [reviewState, setReviewState] = useState({
    content: null,
    product: null,
    stars: 0,
    uploadFiles: [],
    iAgreeDataProcessing: true,
    profile: null,
    recaptcha: '',
  });

  const sendReview = (data) => {
    if (!data.iAgreeDataProcessing) return openModalFinalyAddReview(false);
    const params = {
      files: data.uploadFiles,
      product: product,
      stars: data.stars,
      content: data.content,
      profile: profile,
    };
    if (!params.stars || !params.content) {
      return openModalFinalyAddReview(false, 'Неправильно введены данные!');
    }
    apiContent
      .postReviews(params)
      .then((res) => {
        openModalFinalyAddReview(true);
        closeModal();
      })
      .catch((err) => {
        if (err.response.status === ERROR_STATUS.NO_ACCESS) {
          return openModalFinalyAddReview(
            false,
            <div>
              <p>Вы&nbsp;не&nbsp;авторизованы!</p>
              <Link target="_blank" to={'/auhorization'}>
                Авторизоватся?
              </Link>
            </div>,
          );
        }
        openModalFinalyAddReview(false, 'Неправильно введены данные!');
      });
  };

  return (
    <Formik enableReinitialize initialValues={reviewState} onSubmit={sendReview}>
      {({ handleSubmit, values, setFieldValue, handleChange }) => {
        const canselationCallback = () => {
          const arr = Array.from(values.uploadFiles);
          setFieldValue('content', null)
          setFieldValue('stars', 0)
          setFieldValue('uploadFiles', arr.length=0)
          closeModal();
        }
        return (
          <GxForm novalidate onGx-submit={handleSubmit}>
            <ModalContentViews.FormAddReview full>
              <textarea
                //value={values.content}
                value={!!values.content?values.content:''}

                onInput={handleChange}
                className={style["productreviews__form-textarea"]}
                placeholder="Текст отзыва"
                name={'content'}
                // data-cy={`productReviews_form-textarea`}
              ></textarea>
              <ModalContentViews.FormAddReviewUploadImage
                values={values}
                setFieldValue={setFieldValue}
              />
              <ModalContentViews.FormAddReviewRating
                values={values}
                setFieldValue={setFieldValue}
              />
              <Captcha
                name={'review'}
                handleValue={(value) => {
                  setFieldValue('recaptcha', value);
                }}
              />

              <ModalContentViews.FormAddReviewController
                values={values}
                setFieldValue={setFieldValue}
                canselationCallback={canselationCallback}
              />
            </ModalContentViews.FormAddReview>
          </GxForm>
        );
      }}
    </Formik>
  );
};

export default React.memo(ModalAddReview);
