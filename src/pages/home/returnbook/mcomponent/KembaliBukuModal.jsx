import { useEffect, useRef, useState } from 'react';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';
import CloseIcon from '../../../../assets/icon/CloseIcon';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useHistory } from 'react-router-dom';

export default function KembaliBukuModal({ handleGetRefKembaliBuku,book,borrowed,denda,borrowedBooks,member_id }) {
  const modalCreate = useRef(null);
  const formInput = useRef(null);
  const [state, dispatch] = useStateGlobal();
  
  useEffect(() => {
    handleGetRefKembaliBuku(modalCreate);
  }, [handleGetRefKembaliBuku]);

  function closeModalCrete() {
    if(modalCreate.current)
      modalCreate.current.style.visibility = 'hidden';
  }

  async function handleSubmitKembaliBuku(e) {
    if (window.confirm('return books')) {
      dispatch({ type: UPDATE_MEMBER, loading: true });
      
      //update data buku setelah dikembalikan
      //when the book return, add 1 for the number of available book
      const bookData = state.book.filter((c)=>c._id === borrowed.book)
      const availableChange = bookData[0].available + 1;
        await patchData(
          `${ServerURL}/book/${borrowed.book}`,
          { available: availableChange },
          localStorage.getItem('token')
        );

      //update data member
      //remove entri peminjaman yang mau dikembalikan dari list borrowedBooks
      borrowedBooks = borrowedBooks.filter(borrowedBook=>{
        if(borrowedBook.book != borrowed.book)
          return borrowedBook
      })
      const changeMember = await patchData(
        `${ServerURL}/member/${member_id}`,
        {borrowedBooks},
        localStorage.getItem('token')
      );

      //update data setelah pengembalian selesai
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
          <button type='submit'>Kembali Buku</button>
        </form>
      </div>
    </div>
  );
}
