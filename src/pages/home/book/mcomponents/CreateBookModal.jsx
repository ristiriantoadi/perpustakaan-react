import { useEffect, useRef, useState } from 'react';
import { getData, postData } from '../../../../library/AxiosLib';
import { useStateGlobal } from '../../../../utils/GlobalState';
import { ServerURL } from '../../../../config/default.json';
import { GET_DATA, POST_BOOK } from '../../../../utils/types';
import CloseIcon from '../../../../assets/icon/CloseIcon';

export default function CreateBookModal({ handleGetRefCreateBook }) {
  const [formInputBook, setFormInputBook] = useState({});
  const modalCreate = useRef(null);
  const formInput = useRef(null);
  const [state, dispatch] = useStateGlobal();

  useEffect(() => {
    handleGetRefCreateBook(modalCreate);
  }, [handleGetRefCreateBook]);

  function closeModalCrete() {
    modalCreate.current.style.visibility = 'hidden';
  }

  function handleChngeCreateBook(e) {
    setFormInputBook({ ...formInputBook, [e.target.name]: e.target.value });
  }

  function handleSubmitBookCreate(e) {
    if (state.loading !== true) {
      const {
        author,
        title,
        isbn,
        available,
        name,
        date,
        country,
      } = formInputBook;
      const newStateFprmCreateBook = {
        author,
        title,
        isbn,
        available,
        publisher: {
          country,
          date,
          name,
        },
      };
      
      dispatch({ type: POST_BOOK, loading: true });
      postData(
        `${ServerURL}/book`,
        newStateFprmCreateBook,
        localStorage.getItem('token')
      )
        .then(() => {
          getData(`${ServerURL}/book`, localStorage.getItem('token')).then(
            (response) => {
              dispatch({
                type: GET_DATA,
                member: state.member,
                book: response.data.book,
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

  return (
    <div className='containerModalCreate modal' ref={modalCreate}>
      <div>
        <form onSubmit={handleSubmitBookCreate} ref={formInput}>
          <div>
            <span>Tambah Buku</span>
            <div onClick={closeModalCrete}>
              <CloseIcon height='20px' width='20px' color='black' />
            </div>
          </div>
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='title'
            placeholder='Title'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='isbn'
            placeholder='ISBN'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='author'
            placeholder='Author'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='name'
            placeholder='Publisher'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='country'
            placeholder='Language'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
            type='text'
            name='date'
            placeholder='Published Date : YYYY-MM-DD'
          />
          <input
            autoComplete='off'
            required
            onChange={handleChngeCreateBook}
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
