import { GxButton, GxIcon, GxInput } from '@garpix/garpix-web-components-react';
import React, { useRef, useEffect } from 'react';
import Text from '../../components/Text';
import { searchIcon } from '../../images';
import Input from '../Input';
import classNames from 'classnames';
import style from './style.module.scss';
import btnStyle from '../Input/styles/Large.module.scss';
import defaultBtnStyle from '../Input/styles/Default.module.scss'

const SearchInput = ({ search, onChangeSearchInput, searchInputShow,setSearchInputShow, onClickSearchRoot }) => {
  const inputRef = useRef();

  useEffect(() => {
      const onClick = e => {
        if(e.target.getAttribute('data-cy') === "header_searche"){
         return setSearchInputShow(true)
        }
          inputRef.current.contains(e.target) || (
            setSearchInputShow(false),
            onClickSearchRoot()
          )
      }
      document.addEventListener('click', onClick);
      return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (inputRef.current && searchInputShow) {
      inputRef.current.setFocus();
    }
  }, [searchInputShow]);
  return (
    <GxInput
      value={search}
      name={'searchContent'}
      autocomplete={'off'}
      onGx-input={onChangeSearchInput}
      className={classNames({
        [defaultBtnStyle['high']] : true,
        [btnStyle['input']]: true,
      })}
      variant={'large'}
      helpText={''}
      label={''}
      placeholder={Text({ text: 'search' })}
      inputmode={'search'}
      autofocus={searchInputShow}
      clearable
      ref={inputRef}
    >
      <GxButton
        className={style['header-buttons__search-btn']}
        slot={'suffix'}
        name={'searchIcon'}
      >
        <GxIcon  src={searchIcon} />
      </GxButton>
    </GxInput>
  );
};

export default React.memo(SearchInput);
