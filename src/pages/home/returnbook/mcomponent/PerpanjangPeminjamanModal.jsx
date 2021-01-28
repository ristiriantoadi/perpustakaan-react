import { useEffect, useRef, useState } from 'react';
import { getData, postData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, POST_MEMBER } from '../../../../utils/types';
import CloseIcon from '../../../../assets/icon/CloseIcon';

export default function PerpanjangPeminjamanModal({ handleGetRefPerpanjangPeminjaman,book,borrowed,denda,member_id }) {
  const [formInputMember, setFormInputMember] = useState({});
  const modalCreate = useRef(null);
  const formInput = useRef(null);
  const [state, dispatch] = useStateGlobal();
  const [day, setDay] = useState();

  useEffect(() => {
    handleGetRefPerpanjangPeminjaman(modalCreate);
  }, [handleGetRefPerpanjangPeminjaman]);

  function closeModalCrete() {
    modalCreate.current.style.visibility = 'hidden';
  }

  function handleChngeCreateMember(e) {
    setFormInputMember({ ...formInputMember, [e.target.name]: e.target.value });
  }

  function handleSubmitMemberCreate(e) {
    if (state.loading !== true) {
      const { name, kelas } = formInputMember;
      const newStateFprmCreateMember = {
        name,
        kelas,
      };
      dispatch({ type: POST_MEMBER, loading: true });
      postData(
        `${ServerURL}/member`,
        newStateFprmCreateMember,
        localStorage.getItem('token')
      )
        .then(() => {
          getData(`${ServerURL}/member`, localStorage.getItem('token')).then(
            (response) => {
              dispatch({
                type: GET_DATA,
                book: state.book,
                member: response.data.member,
                loading: false,
              });
              formInput.current.childNodes.forEach((e) => {
                e.value = null;
              });
            }
          );
          modalCreate.current.style.visibility = 'hidden';
        })
        .catch((err) => {
          console.log(err);
        });
    }
    e.preventDefault();
  }

  function handleChangeDay(e) {
    setDay(Number(e.target.value) * 24);
  }

  return (
    <div className='containerModalCreate modal' ref={modalCreate}>
      <div>
        <form onSubmit={handleSubmitMemberCreate} ref={formInput}>
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
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}
