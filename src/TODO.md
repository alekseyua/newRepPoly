  заметки

разрешаем доступ для выполнения скриптов 
Set-ExecutionPolicy RemoteSigned -Scope Process

Login: root
Password: ABkxb52RF8
Выделенный IP: 91.218.229.240
        
    supervisorctl restart Server-Back

GET
http://91.218.229.240:8000/api/v1/order/correspondence_order_item/?order_item_id=№ товара

POST
``````plagin for work VS CODE``````
1) Auto Rename Tag 
2) Auto Import
3) Beautify
4) Better Comments
5) Bracket Pair Colorizer 2
6) Path Intellisense
7) Wrap Console Log -> Turbo Console Log
8) Import Cost
9) 


``````plagin for work Subline Text 3``````
1) Install Package Control
2) Auto Close HTML Tags
3) Emmet
4) Tag (AppData\Roaming\Sublime Text 3\Installed Packages\Tag.sublime-package)
5) Auto Save
5) Wrap Console Log
6) SASS
7) SublimeLinter
8) Color Highlighter
9) BracketHighlighter
10) AutoFileName
11) Side Bar Enhancements
12) Goto css diclaration

Настройка кнопок управления
[
    { "keys": ["ctrl+b"], "command": "toggle_side_bar" },
    { "keys": ["ctrl+shift+s"], "command": "auto_save" },
    { "keys": ["ctrl+1"], "command": "goto_css_declaration",
      "args": {"goto": "next"}
    },
    { "keys": ["ctrl+`"], "command": "tag_classes"},
]

`````REACT тестирование програмы на перерендеринг компонентов для отслеживания rerendering `````
Why Did You Render
https://www.npmjs.com/package/@welldone-software/why-did-you-render

`````REACT увидомления `````
useEffect(()=>{
    function notifyMe () {
      console.log('увидомление отправлено')
      var notification = new Notification ("Все еще работаешь?", {
        tag : "ache-mail",
        body : "Пора сделать паузу и отдохнуть",
        icon : "https://itproger.com/img/notify.png"
      });
    }
    
    //function notifSet 
    (() => {
      if (!("Notification" in window))
        alert ("Ваш браузер не поддерживает уведомления.");
      else if (Notification.permission === "granted")
        setTimeout(notifyMe, 2000);
      else if (Notification.permission !== "denied") {
        Notification.requestPermission (function (permission) {
          if (!('permission' in Notification))
            Notification.permission = permission;
          if (permission === "granted")
            setTimeout(notifyMe, 2000);
        });
      }
    })()

  }, [])


`````удаление куки данных `````
function removeCookie(name) {
                function CookiesDelete() {
                  var cookies = document.cookie.split(";");
                  for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var names = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    if (cookie.substr(0, eqPos).trim() === name){
                      // console.log({names, nnn : (names === name), tn: (typeof name), tv: (typeof cookie.substr(0, eqPos)) })
                      //если нужно будет удалить конкретный куки
                    }
                    document.cookie = names + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                    document.cookie = names + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    window.location.reload();
                }
              }
                CookiesDelete()
  // document.cookie = name + '=; Max-Age=-99999999;';
}

```в линуксе чтобы обойти лимит ```
When this limit is not enough to monitor all files inside a directory, the limit must be increased for Listen to work properly.

You can set a new limit temporary with:

$ sudo sysctl fs.inotify.max_user_watches=524288
$ sudo sysctl -p


```` component for admin ````

                import Settings from '../../#lifehack/Settings/Settings';
                {front_admin?<Settings nameComponent={'TradingPlatformLayout'} /> : null }

condition_pay
https://back.ftownpl.com/admin/garpix_page/component/27/change/


```` избовляемся от тегов  ````
let word = '<p>Ваш заказ должен быть не менее</p>';
console.log('components:', word.replace(/<p>|<\/p>/isg, ''))
console.log('components:', components[0].children[1].content.replace(/<p[^>]+?[^>]+>|<\/p>/isg, ''))


```` попап показа pdf файла ````
dispatch('modal/update', {
      show: true,
      addClass: 'modal-file_views',
      content: (
        <ModalContentViews.ModalPreviewFile>
                <ModalContentViews.CloseBtn closeModal={closeModal} />
                    {<iframe src={file}
                      className='noselect'
                      style={{
                        width: '100%',
                        height: '95vh',                    
                      }}
                    >              
                    </iframe>}
              </ModalContentViews.ModalPreviewFile>
        )
    })
``----------------------------------------------------``

			@include adaptive-value('font-size',33,20,px,2);
			@include adaptive-value('line-height',60,28,px,2);


                  (``адаптивный миксин``)
                  
````************************шрифт размер адаптив****************```

@function strip-unit($number) {
  @if type-of($number) == 'number' and not unitless($number) {
    @return $number / ($number * 0 + 1);
  }

  @return $number;
}

@function calcFluidFontSize($f-min, $f-max, $w-min, $w-max, $units: px) {
  $f-min: strip-unit($f-min);
  $f-max: strip-unit($f-max);
  $w-min: strip-unit($w-min);
  $w-max: strip-unit($w-max);
  
	$k: ($f-max - $f-min)/($w-max - $w-min);
	$b: $f-min - $k * $w-min;

	$b: $b + $units;

	@return calc( #{$k} * 100vw + #{$b} );
}

// миксин адаптивного шрифта

// adaptiv-font(миним размер, макс размер по шаблону, )
@mixin adaptiv-font($f-min, $f-max, $w-min: 320px,$w-max: 1920px, $fallback: false) {
  
  font-size: $f-min;
  
  @media (min-width: $w-min) {
    @if ($fallback) {
      font-size: $fallback;
    }
    font-size: calcFluidFontSize($f-min, $f-max, $w-min, $w-max, px);  
  }
  @media (min-width: $w-max) {
    font-size: $f-max;
  }
}
// **********************************************************************
@extend %font-title;
// ************************свойство-значение адаптив****************

              нужно сделать

// *******************************************************
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

при обновлении в увидомлениях нужно обновлять в 

                        задачи в перспективе: 

1) `нужно сделать попап для ошибки добавления и удаления количества товара в превью`
        ----------------------
2) `// ???????????? под вопросом может не работать как надо нужно проследить`


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        блокировка скрола body при попапе  
  `
  const [isOpen, setIsOpen]=useState();
  useEffect(() => {
    const body = document.querySelector('body');
    body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen])
  
  `
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            `отлавливаем клик вне блока`
  useEffect(() => {
     const onClick = e => clickOutRef.current.contains(e.target) || setClickActiveCurrencies(false)
     document.addEventListener('click', onClick);
     return () => document.removeEventListener('click',onClick)
  }, [])


//**
`
console.log('товар пачка', finishResultIs_pack) - собирает все товары пачкой 



//



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

1)  /** 
    * todo: 1) В админке добавить поиск в товаре
    * + todo: 2) В превью товара добавить обработку видео
    * + todo: 3) Как пользоваться сайтом разобраться с фото
    *  + todo: 4) В каталоге мобильная версия доп инфо не коректно отображаеться 
    * todo 5) авторизация и регистрация : 
              а) отчество не важно
              
    * todo 6) проследить выход с аккаунта
    *  ?todo нужно проверить пункт 4
    */


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    `framer-motion`
<motion.div
  animate={{ y: [0, 150, 150, 0], rotate: 90 }}
  transition={{ duration: 3, repeat: Infinity }}
/>

<motion.div 
    animate={{ x: 100, scale:1.5, rotate:90 }} 
/>

<motion.div 
    whileHover={{ scale: 1.2, opacity: 1 }}
>
  Hover Over Me!
</motion.div>

<motion.input 
    whileFocus={{ scale: 1.2 }} 
/>

<motion.div 
    whileTap={{ scale: 0.5 }} 
/>

<motion.div
  drag
  dragTransition={{
    min: 0,
    max: 100,
    bounceStiffness: 100
  }}
>
 Drag Me!
</motion.div>



// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++





// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
удобные пакеты для работы

1) Bracket Pair Colorizer 2




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
[Переслано от Falser Bridge]
5168 7574 1898 2353. Приватбанк


5168 7450 1590 8418. Приватбанк
