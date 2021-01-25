import { useEffect, useState } from 'react';
import { getData } from '../../../library/AxiosLib';
import { useStateGlobal } from '../../../utils/GlobalState';
import { ServerURL } from '../../../config/default.json';
import { GET_DATA, SEACRH_MEMBER } from '../../../utils/types';
import ListMember from './mcomponent/ListMember';
import './ReturnBook.css';

export default function ReturnBook() {
  const [state, dispatch] = useStateGlobal();
  const [books, setBooks] = useState(null);

  useEffect(() => {
    document.title = 'Perpustakaan - Member';
    if (state.member !== null) {
      const rs = state.member.filter((e) => {
        return e.borrowedBooks.books.length !== 0;
      });
      setBooks(rs);
    }
  }, [state]);

  function handleSearchMember(e) {
    dispatch({ type: SEACRH_MEMBER, loading: true });
    getData(`${ServerURL}/member`, localStorage.getItem('token')).then(
      (res) => {
        const rs = res.data.member.filter((dt) =>
          dt.name.match(new RegExp(e.target.value, 'im'))
        );
        dispatch({
          type: GET_DATA,
          book: state.book,
          member: rs,
          loading: false,
        });
      }
    );
  }

  return (
    <section className='member content'>
      <div className='first'>
        <div>
          <input
            autoComplete='off'
            type='text'
            placeholder='Cari : Nama Member'
            onChange={handleSearchMember}
          />
        </div>
      </div>
      <div className='containerListMember'>
        {books !== null &&
          books.map((e, i) => {
            return (
              <ListMember
                name={e.name}
                kelas={e.kelas}
                
                borrowedBooks={e.borrowedBooks}
                id={e._id}
                key={i}
              />
            );
          })}
      </div>
    </section>
  );
}
