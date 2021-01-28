import { useHistory } from 'react-router-dom';
import BooksIcon from '../../../../assets/icon/BooksIcon';
import IdCardIcon from '../../../../assets/icon/IdCardIcon';
import VeritifyUser from '../../../../assets/icon/VeritifyUser';
import { patchData, getData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_MEMBER } from '../../../../utils/types';

export default function ListMember(props) {
  const [state, dispatch] = useStateGlobal();

  const history = useHistory();

  async function handleClickBorrow(){
    
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
            {props.borrowedBooks.books.map((e, i) => {
              const bookData = state.book.filter((c) => c._id === e);
              return (
                <div key={i} className="row-buku-pinjam">
                  <div>
                    <li>{bookData[0].title}</li>
                    <span>Kembali: 2021-01-07</span>
                  </div>
                  <div>
                    <button>Kembali</button>
                    <button>Perpanjang</button>
                  </div>
                </div>
              )
              
              
            })}
          </ol>
        </div>
      </div>
      <IdCardIcon height='200px' width='200px' color='#e1e4e8' />
    </div>
  );
}
