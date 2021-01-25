import { useEffect, useState } from 'react';
import PlusIcon from '../../../assets/icon/PlusIcon';
import { getData } from '../../../library/AxiosLib';
import { useStateGlobal } from '../../../utils/GlobalState';
import { ServerURL } from '../../../config/default.json';
import { GET_DATA, SEACRH_BOOK } from '../../../utils/types';
import UpdateBookModal from './mcomponents/UpdateBookModal';
import CreateBookModal from './mcomponents/CreateBookModal';
import ListBook from './mcomponents/ListBook';
import './Book.css';

export default function Book() {
  const [state, dispatch] = useStateGlobal();
  const [refFromModlaCrate, setRefFromModlaCrate] = useState(null);
  const [refFromModlaUpdate, setRefFromModlaUpdate] = useState(null);

  useEffect(() => {
    document.title = 'Perpustakaan - Buku';
  }, []);

  function getRefFromChildCreateBook(e) {
    if (e.current) {
      setRefFromModlaCrate(e);
    }
  }

  function handleClickPlusBook() {
    if (refFromModlaCrate.current) {
      refFromModlaCrate.current.style.visibility = 'visible';
    }
  }

  function getRefFromChildUpdateBook(e) {
    setRefFromModlaUpdate(e);
  }

  function handleSearchBook(e) {
    dispatch({ type: SEACRH_BOOK, loading: true });
    getData(`${ServerURL}/book`, localStorage.getItem('token')).then((res) => {
      const rs = res.data.book.filter((dt) =>
        dt.title.match(new RegExp(e.target.value, 'im'))
      );
      dispatch({
        type: GET_DATA,
        member: state.member,
        book: rs,
        loading: false,
      });
    });
  }

  return (
    <section className='buku content'>
      <CreateBookModal handleGetRefCreateBook={getRefFromChildCreateBook} />
      <UpdateBookModal handleGetRefUpdateBook={getRefFromChildUpdateBook} />
      <div className='first'>
        <div>
          <input
            autoComplete='off'
            type='text'
            placeholder='Cari : Nama Buku'
            onChange={handleSearchBook}
          />
        </div>
        <div onClick={handleClickPlusBook}>
          <span>Tambah Buku</span>
          <PlusIcon height='25px' width='25px' color='#0366d6' />
        </div>
      </div>
      <div className='containerListBook'>
        {state.book &&
          state.book.map((e, i) => {
            return (
              <ListBook
                forwardingRefUpdateToChild={refFromModlaUpdate}
                title={e.title}
                author={e.author}
                isbn={e.isbn}
                available={e.available}
                publisher={e.publisher.name}
                key={i}
                id={e._id}
              />
            );
          })}
      </div>
    </section>
  );
}
