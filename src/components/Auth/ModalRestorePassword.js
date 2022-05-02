import { GxForm } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import React from 'react';
import api from '../../api';
import { confirmEmail } from '../../utils/schemesFormic';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import Button from '../../Views/Button';
import ErrorField from '../../Views/ErrorField';
import Input from '../../Views/Input';
import Text from '../Text';

const apiUser = api.userApi;

const ModalRestorePassword = ({ initialValues, onSaveFormData, setNextStep }) => {
  const errorsMessenge = {
    requiredField: Text({ text: 'requiredField' }),

    email: Text({ text: 'notValidEmail' }),
  };
  const handleSubmit = (params, { setFieldError }) => {
    //todo: Проверять есть ли пользователь с такой почтой
    //todo: обращение к апи с целью отправить код смены пароля
    console.log('work click reset password',params)
    const param = {
      email: params.email,
    }
    apiUser
      .resetUserPassword(param)
      .then(res=>{
        console.log('reset password', res);
        setNextStep();
      })
      .catch(err=>{          
        console.log(`ERROR `,err.response.data)
        if (!!err.response){
          setFieldError({email : err.response.data.detail});
        }
      }
      ) 
    
  };
  return (
    <>
      <AuthorizationAndRegViews.ModalRestorePasswordTitle title={'Сброс пароля'} mb={'30px'} />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={confirmEmail(errorsMessenge)}
      >
        {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => {
          return (
            <GxForm noValidate onGx-submit={handleSubmit} className="form-horizontal">
              <Input
                type={'email'}
                className={'input-mt_20'}
                value={values.email}
                variant={'largeCustomLabel'}
                autocomplete={'off'}
                name={'email'}
                label={'Введите Ваш E-mail, указанный при регистрации'}
                onGx-input={handleChange}
                helpText={
                  errors.email && touched.email ? <ErrorField message={errors.email} /> : null
                }
              />
              <Button
                variant={'black_btn_full_width'}
                type={'submit'}
                disabled={!values.email || errors.email}
              >
                Отправить код
              </Button>
            </GxForm>
          );
        }}
      </Formik>
    </>
  );
};

export default React.memo(ModalRestorePassword);
