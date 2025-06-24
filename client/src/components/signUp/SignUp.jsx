import { useState } from "react"
import styles from "./signUp.module.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function SignUp() {
    const [nameT, setName] = useState("");
    const [phoneNoT, setPhoneNo] = useState("");
    const [passwordT, setPassword] = useState("");
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        const name = nameT.trim()
        const phoneNo = phoneNoT.trim()
        const password = passwordT.trim()
        if (name.length != 0 && phoneNo.length == 10 && password.length >= 8) {
            try {
                const url = import.meta.env.VITE_API_BASE_URL + "/sign-up";
                const res = await axios.post(url, { name, phoneNo, password })
                if (res.ok) console.log(res.data.message);
                navigate('/sign-in')

            } catch (error) {
                console.error(error.response.data.message)
            }
        }

    }




    return <div className={styles.container}>
        <h2 className={styles.h2}>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input type="text" id="name" name="name" className={styles.input} required onChange={(e) => setName(e.target.value)} />
            <br />

            <label htmlFor="phoneNo" className={styles.label}>Phone No</label>
            <input type="text" id="phoneNo" name="phoneNo" className={styles.input} inputMode="numeric" pattern="[0-9]*" maxLength={10} minLength={10} required onChange={(e) => setPhoneNo(e.target.value)} />
            <br />

            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="text" name="password" id="password" className={styles.input} required minLength={8} onChange={(e) => setPassword(e.target.value)} />

            <button className={styles.button}>Submit</button>

            <div className={styles.navigate}>
                Already have an accout? <Link to={'/sign-in'}>Sign In</Link>
            </div>
        </form>
    </div>
}