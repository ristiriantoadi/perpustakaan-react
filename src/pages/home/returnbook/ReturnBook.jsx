import { useEffect, useState } from 'react';
import { getData } from '../../../library/AxiosLib';
import { useStateGlobal } from '../../../utils/GlobalState';
import { ServerURL } from '../../../config/default.json';
import { GET_DATA, SEACRH_MEMBER } from '../../../utils/types';
import ListMember from './mcomponent/ListMember';
import './ReturnBook.css';
// import KembaliBukuModal from './mcomponent/KembaliBukuModal';
// import PerpanjangPeminjamanModal from './mcomponent/PerpanjangPeminjamanModal';

export default function ReturnBook() {
  const [state, dispatch] = useStateGlobal();
  const [refFromModlaKembaliBuku, setRefFromModlaKembaliBuku] = useState(null);
  const [refFromModlaPerpanjangPeminjaman, setRefFromModlaPerpanjangPeminjaman] = useState(null);
  const [books, setBooks] = useState(null);

  useEffect(() => {
    document.title = 'Perpustakaan - Member';
    // console.log("return book use effect called again")
    if (state.member !== null) {
      const rs = state.member.filter((e) => {//this should return the members that have borrowed book, but they put it in books
        return e.borrowedBooks.length !== 0;
      });
      setBooks(rs);
    }
  }, [state]);

  function getRefFromChildKembaliBuku(e) {

    //this thing get called whenever the page load
    // console.log("get ref from child kembali buku called")
    
    //e.current is div.containerModalCreate.modal
    //this is the root div in the return function of CreateMemberModal
    // console.log(e)
    if (e.current) {
      // e.book = {title:"Something",_id:1}
      // e.borrowed = {schedule:"something",book:1}
      // console.log("e: ")
      // console.log(e)
      setRefFromModlaKembaliBuku(e);
    }
  }

  function getRefFromChildPerpanjangPeminjaman(e) {

    //this thing get called whenever the page load
    // console.log("get ref from child kembali buku called")
    
    //e.current is div.containerModalCreate.modal
    //this is the root div in the return function of CreateMemberModal
    // console.log(e)
    if (e.current) {
      setRefFromModlaPerpanjangPeminjaman(e);
    }
  }

  function handleClickKembaliBuku(borrowData,book) {
    // console.log("Borrow data: ")
    // console.log(borrowData)
    // console.log("book: ")
    // console.log(book)
    if (refFromModlaKembaliBuku.current) {
      // refFromModlaKembaliBuku.borrowed = borrowData;
      // refFromModlaKembaliBuku.book = book;
      refFromModlaKembaliBuku.current.style.visibility = 'visible';
    }
  }

  function handleClickPerpanjangPeminjaman() {
    if (refFromModlaPerpanjangPeminjaman.current) {
      refFromModlaPerpanjangPeminjaman.current.style.visibility = 'visible';
    }
  }

  function handleSearchMember(e) {
    dispatch({ type: SEACRH_MEMBER, loading: true });
    getData(`${ServerURL}/member`, localStorage.getItem('token')).then(
      (res) => {
        // console.log(res.data.member)
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

  function setBook(book){

  }

  return (
    <section className='member content'>
      {/* <KembaliBukuModal
        handleClickKembaliBuku={handleClickKembaliBuku}
        handleGetRefKembaliBuku={getRefFromChildKembaliBuku}
      /> */}
      {/* <PerpanjangPeminjamanModal
        handleGetRefPerpanjangPeminjaman={getRefFromChildPerpanjangPeminjaman}
      /> */}
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
                // handleClickKembaliBuku={handleClickKembaliBuku}
                // handleClickPerpanjangPeminjaman={handleClickPerpanjangPeminjaman}
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
