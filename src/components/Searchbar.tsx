import './Searchbar.css';
import { IonItem, IonSearchbar } from '@ionic/react'
import { useEffect, useState } from 'react'

type Props = {
  refetch: any
}

const Searchbar = ({ refetch }: Props) => {
  const [searchText, setSearchText] = useState<string>()
  const [needReload, setNeedReload] = useState(false)

  useEffect(() => {
    if (searchText === '') {
      refetch()
      setSearchText(undefined)
      return
    } else if (needReload) {
      refetch({ search: searchText })
      setNeedReload(false)
      return
    }
  }, [searchText, refetch, needReload])

  return (
    <IonItem>
      <IonSearchbar
        className='Ion__Searchbar'
        value={searchText}
        onIonChange={(e) => {
          setNeedReload(true)
          setSearchText(e.detail.value!)
        }}
        placeholder='Buscar'
        debounce={300}
      ></IonSearchbar>
    </IonItem>
  )
}

export default Searchbar
