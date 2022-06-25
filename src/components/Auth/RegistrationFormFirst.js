import React, { useEffect, useState } from 'react';
import { GxForm, GxIcon } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import Input from '../../Views/Input';
import ErrorField from '../../Views/ErrorField';
import Button from '../../Views/Button';
import CheckBox from '../../Views/CheckBox';
import Text from '../Text';
import { signUpFirstFormSchema } from '../../utils/schemesFormic';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import { toolTipIcon } from '../../images';
import Error from '../../Views/Error';

const RegistrationFormFirst = ({ onSaveFormData, initialValues, activeSpinner }) => {

  const errorsMessenge = {
    requiredField: Text({ text: 'requiredField' }),
    shortLastName: Text({ text: 'short.last.name' }),
    longLastName: Text({ text: 'longLastName' }),
    shortFirstname: '',
    longFirstname: Text({ text: 'long.first.name' }),
    shortPatronymic: '',
    longPatronymic: Text({ text: 'long.patronymic' }),
    shortusername: '',
    longusername: 'Слишком длинный никнейм!',
    username: 'Некоректный никнейм',
    symbol: 'Поле не должно содержать спец. символы',
  };

  return (
    <Formik
      validationSchema={signUpFirstFormSchema(errorsMessenge)}
      initialValues={initialValues}
      onSubmit={onSaveFormData}
    >
      {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched }) => {
        console.log('errors',errors)
        return (
          <GxForm noValidate onGx-submit={handleSubmit}>
            <Input
              value={values.lastname}
              variant={'largeCustomLabel'}
              className={'input-mt_20'}
              name={'lastname'}
              data-cy={'registration_last_name'}
              autocomplete={'off'}
              onBlur={handleBlur}
              onGx-input={(e) => setFieldValue('lastname', e.target.value.trim())}
              placeholder={Text({ text: 'enterLastName' })}
              label={Text({ text: 'lastname' })}
              helpText={errors.lastname && touched.lastname ? <ErrorField message={errors.lastname} /> : null}
            />
            <Input
              className={'input-mt_20'}
              value={values.firstname}
              variant={'largeCustomLabel'}
              name={'firstname'}
              data-cy={'registration_first_name'}
              autocomplete={'off'}
              onBlur={handleBlur}
              label={Text({ text: 'firstname' })}
              placeholder={Text({ text: 'enterFirstName' })}
              onGx-input={(e) => setFieldValue('firstname', e.target.value.trim())}
              helpText={errors.firstname && touched.firstname ? <ErrorField message={errors.firstname} /> : null}
            />
            <Input
              className={'input-mt_20'}
              value={values.patronymic}
              variant={'largeCustomLabel'}
              placeholder={Text({ text: 'enterPatronymic' })}
              name={'patronymic'}
              onBlur={handleBlur}
              data-cy={'registration_middle_name'}
              autocomplete={'off'}
              label={Text({ text: 'patronymic' })}
              onGx-input={(e) => setFieldValue('patronymic', e.target.value.trim())}
              helpText={errors.patronymic && touched.patronymic ? <ErrorField message={errors.patronymic} /> : null}
            />
            <AuthorizationAndRegViews.WrapperInputForTooltip
              content={Text({ text: 'tooltipDatausername' })}
              trigger={'hover'}
            >
              <Input
                className={'input-mt_20'}
                value={values.username}
                variant={'largeCustomLabel'}
                placeholder={Text({ text: 'enterusername' })}
                name={'username'}
                onBlur={handleBlur}
                data-cy={'registration_nick_name'}
                autocomplete={'off'}
                label={Text({ text: 'username' })}
                onGx-input={(e) => setFieldValue('username', e.target.value.trim())}
                helpText={errors.username && touched.username ? <ErrorField message={errors.username} /> : null}
              >
                <GxIcon slot={'suffix'} src={toolTipIcon} />
              </Input>
            </AuthorizationAndRegViews.WrapperInputForTooltip>
            <div>
            <CheckBox
              checked={values.iAgreeDataProcessing}
              name={'iAgreeDataProcessing'}
              data-cy={'registration_check_box'}
              label={Text({ text: 'iAgreeDataProcessing' })}
              onGx-change={(e) => {
                let checked = e.target.checked;
                if (checked === null) return;
                setFieldValue('iAgreeDataProcessing', checked);
              }}
              />
              {/* {values.iAgreeDataProcessing ? <ErrorField message={errors.iAgreeDataProcessing} /> : null} */}
            {errors.iAgreeDataProcessing && touched.iAgreeDataProcessing ? <Error message={!!errors.iAgreeDataProcessing?'необходимо соглассие на обработку данных': null} /> : null}
            </div>
            <Button
              variant={'black_btn_full_width'}
              type={'submit'}
              data-cy={'registration_button'}
              className={activeSpinner}

            >

              <Text text={'saveAndContinue'} />
            </Button>
          </GxForm>
        );
      }}
    </Formik>
  );
};

export default React.memo(RegistrationFormFirst);
