
function LocalStorage() {

    const setItem = ((key: any, object: any) => {
        localStorage.setItem(key, JSON.stringify(object))
    })

    const clear = (() => {
        localStorage.clear()
    })

    const getItem = ((key: any) => {
        localStorage.getItem(key)
        let objectStorage = localStorage.getItem(key)
        if (objectStorage != null) return JSON.parse(objectStorage);
    })

    return { setItem, clear, getItem }
}

export default LocalStorage