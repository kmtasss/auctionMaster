import { useRef, useState, useEffect, } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import './register.css';
import registerLogo from '../images/logotype.png'

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
    // const csrftoken = Cookies.get('csrftoken');
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    // const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPwd, setValidPwd] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    // useEffect(() => {
    //     setValidName(USER_REGEX.test(email));
    // }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd])

    // useEffect(() => {
    //     setErrMsg('');
    // }, [email, password, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        // const v1 = USER_REGEX.test(email);
        const v2 = PWD_REGEX.test(password);
        try {
            const response = await axios.post('http://130.193.40.81:8000/api/register/users/',
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000'},
                    withCredentials: true,
                    mode: 'no-cors'
                }
            );
            console.log(response?.data);
            // console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUsername('');
            setPassword('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Нет ответа сервера');
            } else if (err.response?.status === 409) {
                setErrMsg('Имя пользователя занято');
            } else {
                setErrMsg('Регистрация не удалась')
            }
        }
    }

    const getData = async () => {
        // if button enabled with JS hack
        // const v1 = USER_REGEX.test(email);
        try {
            const response = await axios.get('http://130.193.40.81:8000/api/lots',
                {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' },
                    withCredentials: true,
                    mode: 'no-cors',
                }
            );
            console.log(response?.data);
            console.log(response);
            // console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUsername('');
            setPassword('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                console.log(!err.response);
                setErrMsg('Нет ответа сервера');
            } else if (err.response?.status === 409) {
                setErrMsg('Имя пользователя занято');
            } else {
                setErrMsg('Регистрация не удалась')
            }
        }
    }


    return (
        <>
            {success ? (
                <section>
                    <h1>Успешно!</h1>
                    <p>
                        <a href="sign-in">Войти</a>
                    </p>
                </section>
            ) : (
                <section className="register_section">
                    <div className="register_logo">
                        <img style={{width:'150px', height: '150px'}} className="registerLogo" src={registerLogo} alt='logo'/>
                    </div>
                    <h1 className="register_title">Зарегистрироваться в UDV store</h1>
                        <div className="card register_card">
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <form className="register_form" onSubmit={handleSubmit}>
                        <input className="register_input"
                            type="text"
                            id="username"
                               placeholder="Логин"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            // aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            // onFocus={() => setUserFocus(true)}
                            // onBlur={() => setUserFocus(false)}
                        />
                        {/*<p id="uidnote">*/}
                        {/*    <FontAwesomeIcon icon={faInfoCircle} />*/}
                        {/*    Корпоративный email адрес.<br/>*/}
                        {/*    Должен содержать почтовый домен @ussc.ru*/}
                        {/*</p>*/}


                        <label htmlFor="password">
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </label>
                        <input className="register_input"
                            type="password"
                            id="password"
                               placeholder="Пароль"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={!validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            От 8 to 24 символов.<br />
                           Должен содержать прописные и строчные буквы <br />
                        </p>


                        <label htmlFor="confirm_pwd">
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input className="register_input"
                            type="password"
                            id="confirm_pwd"
                               placeholder="Подтвердить пароль"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                          Пароли должны совпадать.
                        </p>

                        <button onClick={getData} className="register_btn">Зарегистрироваться</button>
                    </form>
                    <p>
                        Уже зарегистрированы?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="sign-in">Войти</a>
                        </span>
                    </p>
                        </div>
                </section>
            )}
        </>
    )
}

export default Register