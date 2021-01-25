import { Fragment, useEffect } from 'react';
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { getData } from '../../library/AxiosLib';
import { useStateGlobal } from '../../utils/GlobalState';
import { GET_DATA } from '../../utils/types';
import { ServerURL } from '../../config/default.json';
import BookClosedIcon from '../../assets/icon/BookClosedIcon';
import MemberIcon from '../../assets/icon/MemberIcon';
import UserIcon from '../../assets/icon/UserIcon';
import Book from './book/Book';
import Member from './member/Member';
import PowerIcon from '../../assets/icon/PowerIcon';
import Dashboard from './dashboard/Dashboard';
import DashboardIcon from '../../assets/icon/DashboardIcon';
import LoadingIcon from '../../assets/icon/LoadingIcon';
import BooksIcon from '../../assets/icon/BooksIcon';
import BookOpenIcon from '../../assets/icon/BookOpenIcon';
import BorrowBook from './borrowbook/BorrowBook';
import ReturnBook from './returnbook/ReturnBook';
import './Home.css';

export default function Home() {
  const [state, dispatch] = useStateGlobal();
  const history = useHistory();
  if (
    localStorage.getItem('token') === null ||
    localStorage.getItem('username') === null ||
    localStorage.getItem('exp') === null ||
    localStorage.getItem('username') === '' ||
    localStorage.getItem('exp') === '' ||
    localStorage.getItem('token') === ''
  ) {
    localStorage.clear();
    history.push('/login');
  }
  if (new Date(localStorage.getItem('exp')) <= new Date()) {
    localStorage.clear();
    history.push('/login');
  }
  useEffect(() => {
    const book = getData(`${ServerURL}/book`, localStorage.getItem('token'));
    const member = getData(
      `${ServerURL}/member`,
      localStorage.getItem('token')
    );
    Promise.all([book, member])
      .then((response) => {
        const [bookResponse, memberResponse] = response;
        dispatch({
          type: GET_DATA,
          book: bookResponse.data.book,
          member: memberResponse.data.member,
          loading: false,
        });
      })
      .catch(() => {
        history.push('/login');
      });
  }, [dispatch, history]);

  function handleClicPower() {
    if (window.confirm('Logout?')) {
      history.push('/login');
      localStorage.clear();
    }
  }

  return (
    <Fragment>
      <div className='iconLoading'>
        {state.loading && (
          <div>
            <LoadingIcon height='100px' width='100px' color='#0366d6' />
          </div>
        )}
      </div>
      <header>
        <div>
          <span>{localStorage.getItem('username')}</span>
          <UserIcon height='45px' width='45px' color='#0366d6' />
        </div>
      </header>
      <nav>
        <Link to={`/home`}>
          <DashboardIcon height='45px' width='45px' color='white' />
          <span>Dashboard</span>
        </Link>
        <Link to={`/home/buku`}>
          <BookClosedIcon height='45px' width='45px' color='white' />
          <span>Buku</span>
        </Link>
        <Link to={`/home/member`}>
          <MemberIcon height='45px' width='45px' color='white' />
          <span>Member</span>
        </Link>
        <Link to={`/home/pinjam`}>
          <BookOpenIcon height='45px' width='45px' color='white' />
          <span>Pinjam Buku</span>
        </Link>
        <Link to={`/home/kembali`}>
          <BooksIcon height='45px' width='45px' color='white' />
          <span>Kembali Buku</span>
        </Link>
        <div onClick={handleClicPower}>
          <PowerIcon height='45px' width='45px' color='white' />
          <span>Logout</span>
        </div>
      </nav>
      <Switch>
        <Route path='/home' exact component={Dashboard} />
        <Route path='/home/buku' component={Book} />
        <Route path='/home/member' component={Member} />
        <Route path='/home/pinjam' component={BorrowBook} />
        <Route path='/home/kembali' component={ReturnBook} />
      </Switch>
    </Fragment>
  );
}
