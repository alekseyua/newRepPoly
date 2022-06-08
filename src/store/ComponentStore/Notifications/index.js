

export const notifications = store => {
    
    store.on('@init', ()=>({noticeCount:0}));
    store.on('noticeCount/set', ({noticeCount},obj)=>{
        return {noticeCount : obj}
    })
    store.on('noticeCount/inc', ({noticeCount})=>{
        return store.dispatch('noticeCount/set', ++noticeCount)
    })
    store.on('noticeCount/dec', ({noticeCount})=>{
        return store.dispatch('noticeCount/set', --noticeCount)
    })
}