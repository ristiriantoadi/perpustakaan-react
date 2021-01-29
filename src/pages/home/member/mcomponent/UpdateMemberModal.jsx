import { useEffect, useRef } from 'react';
import CloseIcon from '../../../../assets/icon/CloseIcon';
import { getData, patchData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';

export default function UpdateMemberModal(props) {
  const [state, dispatch] = useStateGlobal();

  const modalCreateRef = useRef();

  const name = useRef();
  const kelas = useRef();
  const id = useRef();

  useEffect(() => {
    props.handleGetRefUpdateMember(modalCreateRef);
  }, [props]);

  function closemodalUpdate() {
    modalCreateRef.current.style.visibility = 'hidden';
  }

  function handleOnSubmitUpdateMember(e) {
    if (state.loading !== true) {
      dispatch({ type: UPDATE_MEMBER, loading: true });
      const newStateFprmUpdateMember = {
        name: name.current.value,
        kelas: kelas.current.value,

      };
      patchData(
        `${ServerURL}/member/${id.current.value}`,
        newStateFprmUpdateMember,
        localStorage.getItem('token')
      ).then(() => {
        getData(`${ServerURL}/member`, localStorage.getItem('token')).then(
          (response) => {
            dispatch({
              type: GET_DATA,
              book: state.book,
              member: response.data.member,
              loading: false,
            });
            closemodalUpdate();
          }
        );
      });
    }
    e.preventDefault();
  }

  return (
    <div className='containerModalUpdate modal' ref={modalCreateRef}>
      <div>
        <form onSubmit={handleOnSubmitUpdateMember}>
          <div>
            <span>Ubah Member</span>
            <div onClick={closemodalUpdate}>
              <CloseIcon height='20px' width='20px' color='black' />
            </div>
          </div>
          <input autoComplete='off' ref={id} type='hidden' name='id' />
          <input
            autoComplete='off'
            ref={name}
            required
            type='text'
            name='name'
            placeholder='Nama'
          />
          <input
            autoComplete='off'
            ref={kelas}
            required
            type='text'
            name='kelas'
            placeholder='kelas'
          />

          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}
