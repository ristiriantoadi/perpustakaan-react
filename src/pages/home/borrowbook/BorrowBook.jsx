import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateGlobal } from '../../../utils/GlobalState';
import { patchData, getData } from '../../../library/AxiosLib';
import { GET_DATA, UPDATE_MEMBER } from '../../../utils/types';
import { ServerURL } from '../../../config/default.json';
import './BorrowBook.css';

export default function BorrowBook() {
  const [memberNotBorrowBook, setMemberNotBorrowBook] = useState(null);
  const [count, setCount] = useState([1]);
  const [inputBook, setInputBook] = useState([]);
  const [nameBook, setNameBook] = useState([]);
  const [inputMember, setInputMember] = useState('');
  const [day, setDay] = useState();
  const formRef = useRef();
  const [state, dispatch] = useStateGlobal();

  const history = useHistory();

  useEffect(() => {
    if (state.member !== null && state.member !== undefined) {
      const mmbrNtBr = state.member.filter((e) => {
        return e.borrowedBooks.books.length === 0;
      });
      setMemberNotBorrowBook(mmbrNtBr);
    }
  }, [state]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: UPDATE_MEMBER, loading: true });
    const date = new Date(Date.now() + 3600 * 1000 * day);

    const data = {
      borrowedBooks: {
        books: inputBook,
        schedule: date,
      },
    };

    inputBook.map(async (e) => {
      const book = state.book.filter((f) => f._id === e);
      const availableChange = book[0].available - 1;
      await patchData(
        `${ServerURL}/book/${e}`,
        { available: availableChange },
        localStorage.getItem('token')
      );
    });

    const changeMember = await patchData(
      `${ServerURL}/member/${inputMember.substring(0, 24)}`,
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
        history.push('/home/kembali');
      }
    }
  }

  function handleClickPlus() {
    if (count.length <= 4) {
      setCount([...count, count.length + 1]);
    }
  }

  function handleChangeBook(e) {
    setInputBook([
      ...inputBook,
      (inputBook[Number(e.target.id)] = e.target.list.innerText.substring(
        0,
        24
      )),
    ]);
    setNameBook([
      ...nameBook,
      (nameBook[Number(e.target.id)] = e.target.value),
    ]);
  }

  function handleOnchengeInputMember(e) {
    setInputMember(e.target.list.innerText);
  }

  function handleChangeDay(e) {
    setDay(Number(e.target.value) * 24);
  }

  return (
    <section className='borrowbook content'>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <span>Pilih Peminjam</span>
          <input
            list='member'
            placeholder='Pilih peminjam Buku'
            onChange={handleOnchengeInputMember}
          />
          <datalist id='member'>
            {memberNotBorrowBook !== null &&
              memberNotBorrowBook.map((e) => {
                return (
                  <option key={e._id} value={e.name}>
                    {e._id}
                  </option>
                );
              })}
          </datalist>
        </div>
        <div>
          <span>Pilih Buku</span>
          <button type='button' onClick={handleClickPlus}>
            Tambah
          </button>
          {count.map((e, i) => {
            return (
              <BookInput
                ocChangeProps={handleChangeBook}
                key={i}
                name={`inputBook${i}`}
                id={i}
                bookSelect={nameBook}
              />
            );
          })}
          <div className='inputHari'>
            <input
              type='number'
              onChange={handleChangeDay}
              min='1'
              max='30'
              required
            />
            <span>Hari</span>
          </div>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </section>
  );
}

function BookInput(props) {
  const [bookAvilable, setBookAvilable] = useState(null);
  const [state] = useStateGlobal();
  const [book1, book2, book3, book4, book5] = props.bookSelect;

  useEffect(() => {
    if (state.book !== null && state.book !== undefined) {
      const bookAvilable = state.book.filter((e) => {
        return (
          e.available.books !== 0 &&
          e.title !== book1 &&
          e.title !== book2 &&
          e.title !== book3 &&
          e.title !== book4 &&
          e.title !== book5
        );
      });
      setBookAvilable(bookAvilable);
    }
  }, [state, book1, book2, book3, book4, book5]);

  function handleChange(e) {
    props.ocChangeProps(e);
  }

  return (
    <div>
      <input
        list='book'
        name={props.name}
        placeholder='Pilih buku yang di Pinjam'
        onChange={handleChange}
        id={props.id}
      />
      <datalist id='book'>
        {bookAvilable !== null &&
          bookAvilable.map((e, i) => {
            return (
              <option key={i} value={e.title}>
                {e._id}
              </option>
            );
          })}
      </datalist>
    </div>
  );
}
