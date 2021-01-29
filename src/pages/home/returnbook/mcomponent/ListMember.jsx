import IdCardIcon from '../../../../assets/icon/IdCardIcon';
import VeritifyUser from '../../../../assets/icon/VeritifyUser';
import RowBukuPinjam from './RowBukuPinjam';

export default function ListMember(props) {
  
  return (
    <div className='listMember'>
      <div className="content">
        <VeritifyUser height='70px' width='70px' color='#5a32a3' />
        <div className="info">
          <span>{props.name}</span>
          <span> | </span>
          <span>{props.kelas}</span>
          <ol>
            {props.borrowedBooks.map((b, i) => {
              const bookData = state.book.filter((c) => c._id === b.book);
              return (
                <RowBukuPinjam key={i}
                  bookData={bookData}
                  b={b}//b is a single instance of a borrow record
                  borrowedBooks={props.borrowedBooks}
                  member_id = {props.id}
                ></RowBukuPinjam>
              )              
            })}
          </ol>
        </div>
      </div>
      <IdCardIcon height='200px' width='200px' color='#e1e4e8' />
    </div>
  );
}
