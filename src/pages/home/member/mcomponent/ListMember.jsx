import PenIcon from '../../../../assets/icon/PenIcon';
import TrashIcon from '../../../../assets/icon/TrashIcon';
import IdCardIcon from '../../../../assets/icon/IdCardIcon';
import { deleteData, getData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import {
  GET_DATA,
  DELETE_MEMBER,
  UPDATE_MEMBER,
} from '../../../../utils/types';
import VeritifyUser from '../../../../assets/icon/VeritifyUser';

export default function ListMember(props) {
  const [state, dispatch] = useStateGlobal();

  function handleClickUpdate(idGet) {
    dispatch({ type: UPDATE_MEMBER, loading: true });
    if (props.forwardingRefUpdateBookToChild.current) {
      const [
        ,
        idEl,
        nameEl,
        classEl,
      ] = props.forwardingRefUpdateBookToChild.current.childNodes[0].childNodes[0].childNodes;
      idEl.value = null;
      nameEl.value = null;
      classEl.value = null;
      const stateMember = state.member.filter((e) => {
        return e._id === idGet;
      });
      const { name, kelas } = stateMember[0];
      idEl.value = idGet;
      nameEl.value = name;
      classEl.value = kelas;

      dispatch({ type: UPDATE_MEMBER, loading: false });
      props.forwardingRefUpdateBookToChild.current.style.visibility = 'visible';
    }
  }

  function handleClickDelete(id) {
    if (window.confirm('Anda Yakin')) {
      dispatch({ type: DELETE_MEMBER, loading: true });
      deleteData(
        `${ServerURL}/member/${id}`,
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
          }
        );
      });
    }
  }

  return (
    <div className='listMember-member'>
      <div>
        <div
          onClick={() => {
            handleClickDelete(props.id);
          }}>
          <TrashIcon height='30px' width='30px' color='#ea4a5a' />
        </div>
        <div
          onClick={() => {
            handleClickUpdate(props.id);
          }}>
          <PenIcon height='30px' width='30px' color='#34d058' />
        </div>
      </div>
      <div>
        <VeritifyUser height='70px' width='70px' color='#5a32a3' />
        <div>
          <span>{props.name}</span>
          <span>{props.class}</span>
          {/* <span>{props.borrowedBooks.books.length}</span> */}
          <span>{props.borrowedBooks.length}</span>
        </div>
      </div>
      <IdCardIcon height='200px' width='200px' color='#e1e4e8' />
    </div>
  );
}
