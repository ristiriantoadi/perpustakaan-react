import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { postData } from '../../library/AxiosLib';
import { ServerURL } from '../../config/default.json';
import './Login.css';
import LoadingIcon from '../../assets/icon/LoadingIcon';

export default function Login() {
  const [formLogin, setFormLogin] = useState({});
  const [loading, setLoading] = useState(false);
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  const history = useHistory();

  function handleSubmit(e) {
    if (!loading) {
      setLoading(true);
      console.log(formLogin);
      postData(`${ServerURL}/login`, formLogin).then(function (response) {
        const { token, username } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('exp', new Date(Date.now() + 3600 * 1000 * 24));
        setLoading(false);
        history.push('/home');
      });
    }

    e.preventDefault();
  }

  function handleChange(e) {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    document.title = 'Login';
    return () => {
      setFormLogin(null);
    };
  }, []);

  return (
    <div className='login'>
      <form onSubmit={handleSubmit}>
        <span>Login</span>
        <input
          required
          autoComplete='off'
          name='email'
          type='text'
          placeholder='email : zhafran@gmail.com'
          onChange={handleChange}
          ref={inputEmail}
        />
        <input
          required
          autoComplete='off'
          name='password'
          type='password'
          placeholder='password : 123'
          onChange={handleChange}
          ref={inputPassword}
        />
        <button type='submit'>
          {loading ? <LoadingIcon width={'25px'} color={'white'} id={'iconLoading'} /> : 'Submit'}
        </button>
        <Link to='/register'>Register</Link>
      </form>
    </div>
  );
}
