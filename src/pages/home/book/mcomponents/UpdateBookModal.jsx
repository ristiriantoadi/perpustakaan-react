import { useEffect, useRef } from 'react';
import CloseIcon from '../../../../assets/icon/CloseIcon';
import { getData, patchData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, UPDATE_BOOK } from '../../../../utils/types';

export default function UpdateBookModal(props) {
  const [state, dispatch] = useStateGlobal();

  const modalCreateRef = useRef();

  const author = useRef();
  const title = useRef();
  const isbn = useRef();
  const available = useRef();
  const country = useRef();
  const date = useRef();
  const name = useRef();
  const id = useRef();

  useEffect(() => {
    props.handleGetRefUpdateBook(modalCreateRef);
  }, [props]);

  function closemodalUpdate() {
    modalCreateRef.current.style.visibility = 'hidden';
  }

  function handleOnSubmitUpdateBook(e) {
    if (state.loading !== true) {
      dispatch({ type: UPDATE_BOOK, loading: true });
      const newStateFprmUpdateBook = {
        author: author.current.value,
        title: title.current.value,
        isbn: isbn.current.value,
        available: available.current.value,
        publisher: {
          country: country.current.value,
          date: date.current.value,
          name: name.current.value,
        },
      };
      patchData(
        `${ServerURL}/book/${id.current.value}`,
        newStateFprmUpdateBook,
        localStorage.getItem('token')
      ).then((data) => {
        getData(`${ServerURL}/book`, localStorage.getItem('token')).then(
          (response) => {
            dispatch({
              type: GET_DATA,
              member: state.member,
              book: response.data.book,
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
        <form onSubmit={handleOnSubmitUpdateBook}>
          <div>
            <span>Ubah Buku</span>
            <div onClick={closemodalUpdate}>
              <CloseIcon height='20px' width='20px' color='black' />
            </div>
          </div>
          <input autoComplete='off' ref={id} type='hidden' name='id' />
          <input
            autoComplete='off'
            ref={title}
            required
            type='text'
            name='title'
            placeholder='Title'
          />
          <input
            autoComplete='off'
            ref={isbn}
            required
            type='text'
            name='isbn'
            placeholder='ISBN'
          />
          <input
            autoComplete='off'
            ref={author}
            required
            type='text'
            name='author'
            placeholder='Author'
          />
          <input
            autoComplete='off'
            ref={name}
            required
            type='text'
            name='name'
            placeholder='Nama Penerbit'
          />
          <input
            autoComplete='off'
            ref={country}
            required
            type='text'
            name='country'
            placeholder='Language'
          />
          <input
            autoComplete='off'
            ref={date}
            required
            type='text'
            name='date'
            placeholder='Tahun Terbit'
          />
          <input
            autoComplete='off'
            ref={available}
            required
            type='number'
            name='available'
            placeholder='Jumlah'
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
}
