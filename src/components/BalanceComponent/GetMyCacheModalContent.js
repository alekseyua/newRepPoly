import React, { useState, useRef } from 'react';
import { GxForm, GxButton, GxIcon } from '@garpix/garpix-web-components-react';
import { Link, useHistory } from 'react-router-dom';
import ModalContentViews from '../../Views/ModalContentViews';
import Input from '../../Views/Input';
import { paperclip } from '../../images';
import { Formik, ErrorMessage, Form, Field, FieldArray } from 'formik';
import { GetMyCacheModalContentShema } from '../../utils/schemesFormic';
import ErrorField from '../../Views/ErrorField';
import Button from '../../Views/Button';
import Text from '../../components/Text';
import api from '../../api';
import style from './style/getMyCacheModalContent.module.scss'
import { useStoreon } from 'storeon/react';

const GetMyCacheModalContent = ({ closeModal, callback_money }) => {
  const {dispatch} = useStoreon();
  const history = useHistory();
  const orderApi = api.orderApi;
  const [stateClickSend, setStateClickSend] = useState(false)
  const inputRef = useRef()
  const initialValues = {
    fio: '',
    amount: null,
    beneficiaryBankAccountNumber: null,
    beneficiaryBankBIC: null,
    fileInput: null,
  };

  const onSubmit = (data) => {
    if (data.fileInput === null){
      let errMessage = {
        path: null,
        success: null,
        fail : 'Вы не прикрепили файл к заявлению',
      };
      dispatch('warrning/set',errMessage);
    }
    if (!!data.fio && !!data.amount && !!data.beneficiaryBankAccountNumber && !!data.beneficiaryBankBIC && !!data.fileInput ){
      setStateClickSend(true)
        const fdPayments = new FormData();
        fdPayments.set('cost', data.amount);
        fdPayments.set('name', data.fio);
        fdPayments.set('number', data.beneficiaryBankAccountNumber);
        fdPayments.set('bank', data.beneficiaryBankBIC);
        fdPayments.set('receipt', data.fileInput[0].file);
    
      dispatch('spinner')
      orderApi
        .returnManyQuery(fdPayments)
        .then((res) => {
          closeModal();
          let errMessage = {
            path: null,
            success: 'Ваше заявление принято в работу',
            fail : null,
          };
          dispatch('warrning/set',errMessage);
        })
        .catch((err) => {
          if (err.response) {
            console.log("PayModalContent.js ERROR", err.response)
            closeModal();
            let errMessage = {
              path: null,
              success: null,
              fail : 'Возникла проблема с отправкой, попробуйте немного позже',
            };
            dispatch('warrning/set',errMessage);
            }
        });
    }
      // }
    // })
    // .catch((err) =>console.log(`err ${err}`))

  };

  /**
   * Получаем массив файлов из FileList
   * @param {*} fileList 
   */
  const getFileArray = (fileList) => {
    return Array.from(fileList)
  }
  /**
   * Хелпер для установки занчения в формике
   * пример будет актуален для инпутов с одним файлом
   * для множественных значений нужно будет переработать
   * @param {*} event 
   * @param {*} values 
   * @param {*} arrayHelper 
   */
  const handleFileChange = (event, values, arrayHelper) => {

    const arrFiles = getFileArray(event.target.files)
    const file = arrFiles.length ? arrFiles[0] : undefined
    if (!file) return
    // Проверяем есть ли значения
    if (Array.isArray(values)) {
      /**
       * Заменяем значение по индексу 0 на наш новый файл
       * обратите внимение что мы вставляем объект { file: File }
       * так будет лечге валидировать
       * если нужно будет валифировать другие свойства файла то расширьте объект
       * и схему валидации 
       * @example { file: File, type: File.type }
       * 
       * для варианта с множеством файлом предлагаю вам вынести часть
       * кода с <FieldArray> в отдельный компонент, при передачи пропров 
       * компонент будет рендериться зановов и вы будете всегда работать 
       * с чистым arrayHelper и только всегда пушить
       */
      arrayHelper.replace(0, { file })
    } else {
      // Или вставляем если ещё нет ни одного значения
      arrayHelper.push({ file })
    }
    /**
     * Создаём новый fileList, хотя от того можно отказаться
     * вставляем его в наш ref
     */
    const dt = new DataTransfer()
    arrFiles.forEach((file) => {
      dt.items.add(file)
    })
    inputRef.current.files = dt.files
  }
  /**
   * Дополнительное действие при очистке формы
   * без него может не срабатывать onChange
   */
  const handleDelete = () => {
    const dt = new DataTransfer()
    // Тут вставляем пустой FileList
    inputRef.current.files = dt.files
  }
  /**
   * Валидационная схема
   * Если вы будете расширять схему валидации для файла 
   * то начните после file: yup..., ВАШ КОД ДАЛЕЕ
   */
  
  const errorsMessenge = {
    symbol: 'Поле не должно содержать спец. символы',
    fileInput: 'blablabla',
    requiredField: Text({ text: 'requiredField' }),
    // shortComments: Text({ text: 'short.comments' }),
    // longComments: Text({ text: 'long.comments' }),
  };
  /**
   * Функция для печати ошибок
   * для ошибок массивов в errors будет обхект 
   * типа { [НАЗВАНИЕ ОШИБКИ]: ОПИСАНИЕ ОШИБКИ }
   * @param {*} errors 
   */
  const printErrors = (errors) => {
    if (Array.isArray(errors)) {
      return errors.map((obj) => Object.values(obj).map((error) => <p key={error}>{error}</p>))
    }
    if (typeof errors === 'string') {
      return errors
    }
    return null
  }

    const callBackMoney = () => {
      window.open(callback_money)


    }

  return (
    <ModalContentViews.ModalWrapper customClassName={'modal-payments'}>
      <ModalContentViews.CloseBtn closeModal={closeModal} />
      <ModalContentViews.HeaderBlock mb={'20px'} title={'Возврат денежных средств в связи с отменой заказа'} />
      <ModalContentViews.WarningBlock>
        <ModalContentViews.SubTitle>Данные для возврата денежных средств:</ModalContentViews.SubTitle>
        <p>
            Оформление возврата возможно только при наличии скан-копии заявления на возврат,
          прикрепленного в форматах .jpg (jpeg), .png, bmp, .zip, .rar, .pdf. Для отправки нескольких
          файлов, приложите архив (zip, rar) в этой форме.
        </p>
        <div className={style["callback-many"]} onClick={callBackMoney}> Скачать образец заявления</div>
      </ModalContentViews.WarningBlock>
      <ModalContentViews.ContentBlock>
        <ModalContentViews.ContentBlock>
          <Formik
            // validationSchema={payModalScheme(errorsMessenge)}
            validateOnChange
            validateOnBlur
            validateOnMount
            validationSchema={GetMyCacheModalContentShema(errorsMessenge)}
            initialValues={initialValues}
            onSubmit={async (values) => {
              onSubmit(values)
            }}
          >
            {({ errors, touched, values, isValid, handleSubmit, handleReset }) => {

              return (
                <Form
                  className={style['form__group']}
                >
                  <div className={style["form__wrapper"]}>

                    <label
                      className={style['label-mt_20']}
                    >
                      Сумма*
                      <Field
                        name={'amount'}
                        className={style['input-mt_20']}
                        type={'number'}
                        value={values.amount}
                      />
                      {errors.amount && touched ? (
                        <ErrorField message={errors.amount} />
                      ) : null}
                    </label>

                    <label
                      className={style['label-mt_20']}
                    >
                      ФИО владельца счёта*
                      <Field
                        name={'fio'}
                        className={style['input-mt_20']}
                        type={'text'}
                        value={values.fio}
                      />
                      {errors.fio && touched ? <ErrorField message={errors.fio} /> : null}
                    </label>


                    <label
                      className={style['label-mt_20']}
                    >
                      № счёта в банке получателе*
                      <Field
                        name={'beneficiaryBankAccountNumber'}
                      className={style['input-mt_20']}
                        type={'number'}
                        value={values.beneficiaryBankAccountNumber}
                      />
                      {
                        errors.beneficiaryBankAccountNumber && touched ? (
                          <ErrorField message={errors.beneficiaryBankAccountNumber} />
                        ) : null
                      }
                    </label>

                    <label
                      className={style['label-mt_20']}
                    >
                      БИК банка получателя*
                      <Field
                        name={'beneficiaryBankBIC'}
                        className={style['input-mt_20']}
                        type={'text'}
                        value={values.beneficiaryBankBIC}
                      />
                      {
                        errors.beneficiaryBankBIC && touched ? (
                          <ErrorField message={errors.beneficiaryBankBIC} />
                        ) : null
                      }
                    </label>

                    <label
                      className={style['label-mt_20']}
                      htmlFor={`fileInput`}
                    >
                      Прикрепить
                    </label>
                    <FieldArray
                      name={`fileInput`}
                      render={arrayHelper => (
                        <>
                          <input
                            // multiple
                            ref={inputRef}
                            name={`fileInput`}
                            type={`file`}
                            // accept={`.pdf`}
                            onChange={(event) => {
                              handleFileChange(event, values.fileInput, arrayHelper)
                            }}
                          />
                          {/* {printErrors(errors.fileInput)} */}
                        </>
                      )}
                    />
                      {/* {errors?.fileInput && touched ? <Error message={errors?.fileInput} /> : null} */}
                      {/* {getArrErrorsMessages(errors.file).map((error) => getError(true, error))} */}
                  </div>

                  <hr>
                  </hr>
                  <button 
                    type="submit" 
                    // disabled={!isValid}
                    style={{
                      pointerEvents: stateClickSend? 'none' : 'auto',
                      backgroundColor: stateClickSend? '#c3c3c3' : null,
                    }} 
                    onClick={handleSubmit}
                    className={style['button__form']}
                  >оформить возврат</button>
                </Form>
              )
            }}
          </Formik>
        </ModalContentViews.ContentBlock>
      </ModalContentViews.ContentBlock>
    </ModalContentViews.ModalWrapper>
  );
};

export default React.memo(GetMyCacheModalContent);
