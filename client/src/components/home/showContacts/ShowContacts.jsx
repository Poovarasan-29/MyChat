import axios from "axios"
import styles from './showContacts.module.css'
import { useState } from "react";
import { useEffect } from "react"

export default function ShowContacts({ userData, setReceiver }) {
    const [contacts, setContacts] = useState([]);
    const [clickedContact, setClickedContact] = useState(null)

    async function getContacts() {
        try {
            const url = import.meta.env.VITE_API_BASE_URL + `/get-user-contacts/${userData.phoneNo}`;
            const res = await axios.get(url)
            // console.log(res?.data?.contacts);
            
            setContacts(res?.data?.contacts || [])
        } catch (error) {
            console.error(error.response.data.message)
        }
    }
    useEffect(() => {
        getContacts()
    }, [])

    function handleContactClick(phoneNo, index) {
        setReceiver(phoneNo)
        setClickedContact(index)
    }

    return <aside style={{ width: '20%', height: '100%', overflowY: 'scroll', borderRight: '2px solid #252525' }}>
        <ul className={styles.ul}>
            {
                contacts.map((contact, index) =>
                    <li
                        key={index}
                        style={{ padding: '9px' }}
                        className={index == clickedContact ? styles.clickedContact : styles.li}
                        onClick={() => handleContactClick(contact.phoneNo, index)}
                    >
                        <p style={{ color: '#c7c7c7', fontWeight: 'bold' }}>
                            {contact.name}
                        </p>
                        {/* <p style={{ fontSize: '12px', color: '#8f8f8f', overflow: 'hidden', marginTop: '4px' }}>
                            Message not valid
                        </p> */}
                    </li>

                )
            }
        </ul>
    </aside>
}