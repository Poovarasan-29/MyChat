import styles from "./home.module.css"
import { useLocation } from 'react-router-dom';
import NewContact from './newContact/NewContact';
import ShowContacts from './showContacts/ShowContacts';
import Chat from "./chat/Chat";
import { useState } from "react";


function Home() {
    const location = useLocation();
    const userData = location.state?.userData;
    // console.log(userData);
    const [receiver, setReceiver] = useState("")

    return <>
        <h1 className={styles.h1}>My Chat</h1>
        <div>
            <h3>
                Name : {userData?.name}
            </h3>
            <h3>
                Phone : {userData?.phoneNo}
            </h3>
        </div>
        <NewContact userData={userData} />

        <main className={styles.main}>
            <ShowContacts userData={userData} setReceiver={setReceiver} />
            <Chat senderPhone={userData?.phoneNo} receiverPhone={receiver} />
        </main>

    </>
}

export default Home;
