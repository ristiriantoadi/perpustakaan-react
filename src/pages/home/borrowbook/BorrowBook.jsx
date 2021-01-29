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

  useEffect(() => {
    if (state.member !== null && state.member !== undefined) {
      const mmbrNtBr = state.member.filter((e) => {//this is finding member that doesnt have borrowed book
        return e.borrowedBooks.length < 5;//maksimal pinjam buku lima kali
      });
      setMemberNotBorrowBook(mmbrNtBr);
    }
  }, [state]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: UPDATE_MEMBER, loading: true });
    const date = new Date(Date.now() + 3600 * 1000 * day);

    // console.log(inputBook)
    
    //find member borrowedBooks
    const member = state.member.filter(m=>{
      if(m._id === inputMember)
        return m
    })[0]
    var borrowedBooks = member.borrowedBooks;
    inputBook.forEach(b=>{
      borrowedBooks.push({
        book:b,
        schedule:date
      })
    })
    // console.log("borrowed book")
    // console.log(borrowedBooks);
    // return;

    const data = {
      borrowedBooks
    };

    //the data needs to be
    // [
    //   {
    //     book,
    //     schedule
    //   } 
    // ]

    inputBook.map(async (e) => {//inputBook is a list of id of will-be-borrowed book
      const book = state.book.filter((f) => f._id === e);//input book should be an array of book id because they compare it with f._id
      const availableChange = book[0].available - 1;//kalau bukunya dipinjam, availablenya kurang satu
      await patchData(//update jumlah buku yang tersedia setelah dipinjam
        `${ServerURL}/book/${e}`,
        { available: availableChange },
        localStorage.getItem('token')
      );
    });

    //this is setting the borrowed book for the member
    //going this way a member can only borrow book one time
    //if he borrow one, and want to borrow again, it will be hard to do it
    const changeMember = await patchData(//this is the function that say user borrrow a book
      `${ServerURL}/member/${inputMember.substring(0, 24)}`,
      // `${ServerURL}/member/${inputMember}`,
      data,
      localStorage.getItem('token')
    );
    
    //as the transaction succesful, get data member 
    //and get data book again, update them
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
    //get member amount of borrowed books
    console.log("handle click plus called")
    if(inputMember !== ''){
      const member = state.member.filter(m=>{
        if(m._id === inputMember){
          return m
        }
      })
      // console.log(member)
      const amountOfBorrowedBook = member[0].borrowedBooks.length
      if (count.length <= 4-amountOfBorrowedBook) {//maksimal cuma bisa pinjam 5 buku (i.e. klik tombol tambah yang merah itu cuma bisa sampai lima kali pinjam)
        setCount([...count, count.length + 1]);
        console.log("count berubah");
      }
    }
  }

  function handleChangeBook(e) {
    console.log("handle change book called")
    // console.log(e.bookAvilable);
    console.log(e.target.value)
    const book = e.bookAvilable.filter(b=>{
      if (b.title === e.target.value){
        return b
      }
    })

    if(book.length != 0){
      setInputBook([
        ...inputBook,//what is e.target.id 
        (inputBook[Number(e.target.id)] = book[0]._id)
      ]);
      
      setNameBook([
        ...nameBook,
        (nameBook[Number(e.target.id)] = book[0].title)
      ]);
    }
  }

  function handleOnchengeInputMember(e) {
    const member = memberNotBorrowBook.filter(m=>{
      if (m.name === e.target.value){
        return m
      }
    })
    if(member.length != 0)
      setInputMember(member[0]._id);
  }

  function handleChangeDay(e) {
    setDay(Number(e.target.value) * 24);
  }

  function generateBookInput(){
    console.log("generate book input called")
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
            // for(var i=0;i<count.length;i++){
            //   return(
            //     <BookInput
            //       ocChangeProps={handleChangeBook}
            //       key={i}
            //       name={`inputBook${i}`}
            //       id={i}
            //       bookSelect={nameBook}
            //     />  
            //   )
            // }
          }
          {/* {count.map((e, i) => {
            return (
              <BookInput
                ocChangeProps={handleChangeBook}
                key={i}
                name={`inputBook${i}`}
                id={i}
                bookSelect={nameBook}
              />
            );
          })} */}
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
      
      const bookAvilable = state.book.filter((e) => {
        var available=true;
        // console.log("props")
        // console.log(props.memberId)
        if(props.memberId){
          const member = state.member.filter(m=>{
            if(m._id === props.memberId){
              return m
            }
          })
          // console.log("member")
          // console.log(member)
          const memberBorrowedBookIds = member[0].borrowedBooks.map(b=>{
            return b.book
          })
          memberBorrowedBookIds.forEach(id=>{
            console.log("book id: "+e._id)
            console.log("member borrowed book id: "+id)
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
        // return (
        //   e.available.books !== 0 &&//shouldnt this just e.available !== 0
        //   e.title !== book1 &&
        //   e.title !== book2 &&
        //   e.title !== book3 &&
        //   e.title !== book4 &&
        //   e.title !== book5
        // );
      });
      console.log("book available: ")
      console.log(bookAvilable);
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
