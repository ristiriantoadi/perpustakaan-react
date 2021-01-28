import { useEffect, useRef, useState } from 'react';
// import { getData, postData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';
import CloseIcon from '../../../../assets/icon/CloseIcon';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useHistory } from 'react-router-dom';

export default function KembaliBukuModal({ handleGetRefKembaliBuku,book,borrowed,denda,borrowedBooks,member_id }) {
  const [formInputMember, setFormInputMember] = useState({});
  const modalCreate = useRef(null);
  const formInput = useRef(null);
  const [state, dispatch] = useStateGlobal();
  const history = useHistory();

  useEffect(() => {
    handleGetRefKembaliBuku(modalCreate);
  }, [handleGetRefKembaliBuku]);

  function closeModalCrete() {
    modalCreate.current.style.visibility = 'hidden';
  }

  function handleChngeCreateMember(e) {
    setFormInputMember({ ...formInputMember, [e.target.name]: e.target.value });
  }

  async function handleSubmitKembaliBuku(e) {
    if (window.confirm('return books')) {
      dispatch({ type: UPDATE_MEMBER, loading: true });
      const bookData = state.book.filter((c)=>c._id === borrowed.book)
      console.log("book data")
      console.log(bookData[0])
      const availableChange = bookData[0].available + 1;
        await patchData(
          `${ServerURL}/book/${borrowed.book}`,
          { available: availableChange },
          localStorage.getItem('token')
        );

      borrowedBooks = borrowedBooks.filter(borrowedBook=>{
        if(borrowedBook.book != borrowed.book)
          return borrowedBook
      })

      console.log("borrowed books")
      console.log(borrowedBooks)

      const data = {
        borrowedBooks
      }

      const changeMember = await patchData(
        `${ServerURL}/member/${member_id}`,
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
          closeModalCrete();
        }
      }
    }
    e.preventDefault();
  }

  return (
    <div className='containerModalCreate modal kembali-buku-modal' ref={modalCreate}>
      <div className="kembali-buku-modal">
        <form onSubmit={handleSubmitKembaliBuku} ref={formInput}>
          <div>
            <span>Kembali Buku ({book.title})</span>
            <div onClick={closeModalCrete}>
              <CloseIcon height='20px' width='20px' color='black' />
            </div>
          </div>
          <span className="info">Jadwal Kembali: {borrowed.schedule.substring(0, 10)}</span>
          <span className="info">Denda: {denda}</span>  
          {/* <input
            autoComplete='off'
            required
            onChange={handleChngeCreateMember}
            type='text'
            name='name'
            placeholder='Nama'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateMember}
            type='text'
            name='kelas'
            placeholder='kelas'
          /> */}
          <button type='submit'>Kembali Buku</button>
        </form>
      </div>
    </div>
  );
}
