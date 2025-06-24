import { useState } from "react"
import styles from "../signUp/signUp.module.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function SignIn() {
    const [phoneNoT, setPhoneNo] = useState("");
    const [passwordT, setPassword] = useState("");
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const phoneNo = phoneNoT.trim()
        const password = passwordT.trim()
        if (phoneNo.length == 10 && password.length >= 8) {
            try {
                const url = import.meta.env.VITE_API_BASE_URL + "/sign-in";
                const res = await axios.post(url, { phoneNo, password })
                navigate('/mychat', { state: { userData: res.data.user } })

            } catch (error) {
                console.error(error.response.data.message)
            }
        }

    }




    return <div className={styles.container}>
        <h2 className={styles.h2}>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>


            <label htmlFor="phoneNo" className={styles.label}>Phone No</label>
            <input type="text" id="phoneNo" name="phoneNo" className={styles.input} inputMode="numeric" pattern="[0-9]*" maxLength={10} minLength={10} required onChange={(e) => setPhoneNo(e.target.value)} />
            <br />

            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="text" name="password" id="password" className={styles.input} required minLength={8} onChange={(e) => setPassword(e.target.value)} />

            <button className={styles.button}>Submit</button>
            <div className={styles.navigate}>
                Don't have an accout? <Link to={'/'}>Sign Up</Link>
            </div>
        </form>
    </div>
}