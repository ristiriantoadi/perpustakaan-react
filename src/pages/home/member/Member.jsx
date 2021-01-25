import { useEffect, useState } from 'react';
import { getData } from '../../../library/AxiosLib';
import { useStateGlobal } from '../../../utils/GlobalState';
import { ServerURL } from '../../../config/default.json';
import { GET_DATA, SEACRH_MEMBER } from '../../../utils/types';
import UpdateMemberModal from './mcomponent/UpdateMemberModal';
import CreateMemberModal from './mcomponent/CreateMemberModal';
import ListMember from './mcomponent/ListMember';
import PlusIcon from '../../../assets/icon/PlusIcon';
import './Member.css';

export default function Member() {
  const [state, dispatch] = useStateGlobal();
  const [refFromModlaCrate, setRefFromModlaCrate] = useState(null);
  const [refFromModlaUpdate, setRefFromModlaUpdate] = useState(null);

  useEffect(() => {
    document.title = 'Perpustakaan - Member';
  }, []);

  function getRefFromChildCreateMember(e) {
    if (e.current) {
      setRefFromModlaCrate(e);
    }
  }

  function handleClickPlusMember() {
    if (refFromModlaCrate.current) {
      refFromModlaCrate.current.style.visibility = 'visible';
    }
  }

  function getRefFromChildUpdateMember(e) {
    setRefFromModlaUpdate(e);
  }

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
      <CreateMemberModal
        handleGetRefCreateMember={getRefFromChildCreateMember}
      />
      <UpdateMemberModal
        handleGetRefUpdateMember={getRefFromChildUpdateMember}
      />
      <div className='first'>
        <div>
          <input
            autoComplete='off'
            type='text'
            placeholder='Cari : Nama Member'
            onChange={handleSearchMember}
          />
        </div>
        <div onClick={handleClickPlusMember}>
          <span>Tambah Member</span>
          <PlusIcon height='25px' width='25px' color='#0366d6' />
        </div>
      </div>
      <div className='containerListMember'>
        {state.member &&
          state.member.map((e, i) => {
            return (
              <ListMember
                forwardingRefUpdateBookToChild={refFromModlaUpdate}
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
