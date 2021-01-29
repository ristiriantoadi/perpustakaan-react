import { useEffect, useRef, useState } from 'react';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';
import CloseIcon from '../../../../assets/icon/CloseIcon';

export default function PerpanjangPeminjamanModal({ handleGetRefPerpanjangPeminjaman,book,borrowed,borrowedBooks,denda,member_id }) {
  const modalCreate = useRef(null);
  const formInput = useRef(null);
  const [day, setDay] = useState();

  useEffect(() => {
    handleGetRefPerpanjangPeminjaman(modalCreate);
  }, [handleGetRefPerpanjangPeminjaman]);

  function closeModalCrete() {
    if(modalCreate.current)
      modalCreate.current.style.visibility = 'hidden';
  }

  async function handleSubmitPerpanjangPeminjaman(e) {
    if (window.confirm('perpanjang peminjaman')) {
      dispatch({ type: UPDATE_MEMBER, loading: true });
      
      //ubah schedule entri peminjaman yang mau diperpanjang dari list borrowedBooks
      const currentScheduleDate=Date.parse(borrowed.schedule);
      const newScheduledate = new Date(currentScheduleDate + 3600 * 1000 * day);    
      borrowedBooks = borrowedBooks.map(borrowedBook=>{
        if(borrowedBook.book == borrowed.book)
          borrowedBook.schedule = newScheduledate
        return borrowedBook
      })

      //update record borrowedBooks member
      const data = {
        borrowedBooks
      }
      const changeMember = await patchData(
        `${ServerURL}/member/${member_id}`,
        data,
        localStorage.getItem('token')
      );

      //update data peminjaman buku
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

  function handleChangeDay(e) {
    setDay(Number(e.target.value) * 24);//convert from days to hours
  }

  return (
    <div className='containerModalCreate modal' ref={modalCreate}>
      <div>
        <form onSubmit={handleSubmitPerpanjangPeminjaman} ref={formInput}>
          <div>
            <span>Perpanjang Peminjaman ({book.title})</span>
            <div onClick={closeModalCrete}>
              <CloseIcon height='20px' width='20px' color='black' />
            </div>
          </div>
          <span className="info">Jadwal Kembali: {borrowed.schedule.substring(0, 10)}</span>
          <span className="info">Denda: {denda}</span>  
          <div className='info inputHari inputHari-perpanjang-peminjaman-modal'>
            <input
              type='number'
              onChange={handleChangeDay}
              min='1'
              max='30'
              required
            />
            <span>Hari</span>
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}
