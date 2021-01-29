import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useStateGlobal } from '../../../utils/GlobalState';
import { patchData, getData } from '../../../library/AxiosLib';
import { GET_DATA, UPDATE_MEMBER } from '../../../utils/types';
import { ServerURL } from '../../../config/default.json';
import './BorrowBook.css';

export default function BorrowBook() {
  const [memberNotBorrowBook, setMemberNotBorrowBook] = useState(null);
  const [count, setCount] = useState([]);
  const [inputBook, setInputBook] = useState([]);
  const [nameBook, setNameBook] = useState([]);
  const [inputMember, setInputMember] = useState('');
  const [day, setDay] = useState();
  const formRef = useRef();
  const [state, dispatch] = useStateGlobal();

  const history = useHistory();
  const MAX_BORROW = 5

  useEffect(() => {
    if (state.member !== null && state.member !== undefined) {
      //find members that can still borrow books
      //i.e. members that have less than five borrowed books
      const mmbrNtBr = state.member.filter((e) => {
        return e.borrowedBooks.length < MAX_BORROW;
      });
      setMemberNotBorrowBook(mmbrNtBr);
    }
  }, [state]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: UPDATE_MEMBER, loading: true });
    
    //update the data of the borrowed book
    //particularly the number of available book is going to decrease by 1
    inputBook.map(async (e) => {
      const book = state.book.filter((f) => f._id === e);
      const availableChange = book[0].available - 1;
      await patchData(
        `${ServerURL}/book/${e}`,
        { available: availableChange },
        localStorage.getItem('token')
      );
    });


    //update member data

    //find member data that was inputted into 'Peminjam Buku'
    const member = state.member.filter(m=>{
      if(m._id === inputMember)
        return m
    })[0]

    //get the member's borrowedBooks data
    //update the borrowedBooks data with new borrow book data
    var borrowedBooks = member.borrowedBooks;
    const date = new Date(Date.now() + 3600 * 1000 * day);
    inputBook.forEach(b=>{
      borrowedBooks.push({
        book:b,
        schedule:date
      })
    })

    //send request to update member's borrowedBooks data 
    const changeMember = await patchData(
      `${ServerURL}/member/${inputMember.substring(0, 24)}`,
      {borrowedBooks},
      localStorage.getItem('token')
    );
    
    //as the transaction succesful, get data member 
    //and get data book again
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
    if(inputMember !== ''){
      //cari jumlah buku yang dipinjam member
      const member = state.member.filter(m=>{
        if(m._id === inputMember){
          return m
        }
      })
      const amountOfBorrowedBook = member[0].borrowedBooks.length
      
      //set jumlah input 'Tambah Buku'
      if (count.length <= 4-amountOfBorrowedBook) {
        setCount([...count, count.length + 1]);
      }
    }
  }

  function handleChangeBook(e) {
    //cari data buku sesuai dengan yang diinputkan ke dalam input Tambah Buku
    //set ke dalam array InputBook dan NameBook (list buku yang akan dipinjam)
    const book = e.bookAvilable.filter(b=>{
      if (b.title === e.target.value){
        return b
      }
    })
    if(book.length != 0){
      setInputBook([
        ...inputBook, 
        (inputBook[Number(e.target.id)] = book[0]._id)
      ]);
      setNameBook([
        ...nameBook,
        (nameBook[Number(e.target.id)] = book[0].title)
      ]);
    }
  }

  function handleOnchengeInputMember(e) {
    //cari dan set data member sesuai dengan input ke dalam input member
    //set ke variabel InputMember
    const member = memberNotBorrowBook.filter(m=>{
      if (m.name === e.target.value){
        return m
      }
    })
    if(member.length != 0)
      setInputMember(member[0]._id);
  }

  //ubah hari ke dalam format 24 jam
  function handleChangeDay(e) {
    setDay(Number(e.target.value) * 24);
  }

  //render komponen BookInput (input buku yang bakal dipinjam)
  //jumlahnya sama dengan variabel count
  function generateBookInput(){
    var bookInput = [];
    for(var i=0;i<count.length;i++){
      bookInput.push(
        <BookInput
          memberId={inputMember}
          ocChangeProps={handleChangeBook}
          key={i}
          name={`inputBook${i}`}
          id={i}
          bookSelect={nameBook}
        />
      )
    }
    return bookInput;
  }

  return (
    <section className='borrowbook content'>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div>
          <span>Pilih Peminjam</span>
          <input
            type="text"
            list='member'
            placeholder='Pilih peminjam Buku'
            onChange={handleOnchengeInputMember}
          />
          <datalist id='member'>
            {memberNotBorrowBook !== null &&
              memberNotBorrowBook.map((e) => {
                return (
                  <option key={e._id} value={e.name}>
                    {e.name}
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
          {
            generateBookInput()
          }
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

//This is the input box that shows up after we click tambah button
function BookInput(props) {
  const [bookAvilable, setBookAvilable] = useState(null);
  const [state] = useStateGlobal();
  const [book1, book2, book3, book4, book5] = props.bookSelect;

  useEffect(() => {
    if (state.book !== null && state.book !== undefined) {
      //cari buku yang available (bisa dipinjam)
      //kriterianya:
      //  1. jumlahnya lebih dari 0
      //  2. belum pernah dipinjam sebelumnya
      //  3. tidak ada dalam daftar list BookInput (buku yang akan dipinjam)
      const bookAvilable = state.book.filter((e) => {
        var available=true;
        if(props.memberId){
          const member = state.member.filter(m=>{
            if(m._id === props.memberId){
              return m
            }
          })
          const memberBorrowedBookIds = member[0].borrowedBooks.map(b=>{
            return b.book
          })
          memberBorrowedBookIds.forEach(id=>{
            if (e._id === id){
              available=false;
              return;
            }
          })
          if(available == false){
            return;
          }

          if(e.available !== 0 &&
            e.title !== book1 &&
            e.title !== book2 &&
            e.title !== book3 &&
            e.title !== book4 &&
            e.title !== book5  
          ){
            return e
          }
        }
      });
      setBookAvilable(bookAvilable);
    }
  }, [state, book1, book2, book3, book4, book5]);

  function handleChange(e) {
    e.bookAvilable = bookAvilable;
    props.ocChangeProps(e);
  }

  return (
    <div>
      <input
        autoComplete="off"
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
                {e.title}
              </option>
            );
          })}
      </datalist>
    </div>
  );
}
