import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BooksIcon from '../../../../assets/icon/BooksIcon';
import IdCardIcon from '../../../../assets/icon/IdCardIcon';
import VeritifyUser from '../../../../assets/icon/VeritifyUser';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';
import KembaliBukuModal from './KembaliBukuModal';
import PerpanjangPeminjamanModal from './PerpanjangPeminjamanModal';
import RowBukuPinjam from './RowBukuPinjam';

export default function ListMember(props) {
  const [state, dispatch] = useStateGlobal();
  const [refFromModlaPerpanjangPeminjaman, setRefFromModlaPerpanjangPeminjaman] = useState(null);
  const [refFromModlaKembaliBuku, setRefFromModlaKembaliBuku] = useState(null);

  const history = useHistory();

  async function handleClickBorrow(){
    
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

  function handleClickKembaliBuku() {
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

  async function handleClickReturn() {
    if (window.confirm('return books')) {
      dispatch({ type: UPDATE_MEMBER, loading: true });
      // Map
      props.borrowedBooks.books.map(async (e) => {
        const bookData = state.book.filter((c) => c._id === e);
        const availableChange = bookData[0].available + 1;
        await patchData(
          `${ServerURL}/book/${e}`,
          { available: availableChange },
          localStorage.getItem('token')
        );
      });
      // ~Map
      const data = {
        borrowedBooks: {
          books: [],
          schedule: '',
        },
      };
      const changeMember = await patchData(
        `${ServerURL}/member/${props.id}`,
        data,
        localStorage.getItem('token')
      );

      if (changeMember) {
        const getDataMember = await getData(
          `${ServerURL}/member`,
          localStorage.getItem('token')
        );
        const getDataBook = await getData(
          `${ServerURL}/book`,
          localStorage.getItem('token')
        );
        if (getDataMember && getDataBook) {
          dispatch({
            type: GET_DATA,
            book: getDataBook.data.book,
            member: getDataMember.data.member,
            loading: false,
          });
          alert('success');
          history.push('/home/member');
        }
      }
    }
  }

  return (
    <div className='listMember'>
      <div className="content">
        <VeritifyUser height='70px' width='70px' color='#5a32a3' />
        <div className="info">
          <span>{props.name}</span>
          <span> | </span>
          <span>{props.kelas}</span>
          {/* <span>{props.borrowedBooks.schedule.substring(0, 10)}</span> */}
          <ol>
            {props.borrowedBooks.map((b, i) => {
              const bookData = state.book.filter((c) => c._id === b.book);
              // console.log("book data")
              // console.log(bookData[0])
              return (
                <RowBukuPinjam key={i}
                  bookData={bookData}
                  b={b}//b is a single instance of a borrow record
                  borrowedBooks={props.borrowedBooks}
                  member_id = {props.id}
                ></RowBukuPinjam>
              )
              
              
            })}
          </ol>
        </div>
      </div>
      <IdCardIcon height='200px' width='200px' color='#e1e4e8' />
    </div>
  );
}
