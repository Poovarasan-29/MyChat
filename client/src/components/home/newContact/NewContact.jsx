import axios from "axios";
import { useState } from "react"

export default function NewContact({ userData }) {
    const [isNewContactClicked, setIsNewContactClicked] = useState(false)
    const [newContactT, setNewContact] = useState("");
    const [contactAddedResponse, setContactAddedResponse] = useState("");
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)

    function handleCancel() {
        setIsNewContactClicked(false)
        setNewContact("")
        setContactAddedResponse("")
    }


    async function handleSave() {
        const newContact = newContactT.trim();
        if (/^\d{10}$/.test(newContact) && newContact !== userData.phoneNo) {
            setSaveButtonDisabled(true)
            try {
                const url = import.meta.env.VITE_API_BASE_URL + "/new-contact";
                await axios.post(url, {
                    newContact,
                    userContact: userData.phoneNo
                });

                setContactAddedResponse("Contact Added");
                setNewContact("");
                setIsNewContactClicked(false);

                setTimeout(() => {
                    setContactAddedResponse("");
                }, 1000);
            } catch (error) {
                const errMsg = error?.response?.data?.message || "Something went wrong";
                setContactAddedResponse(errMsg);
                setTimeout(() => {
                    setContactAddedResponse("");
                }, 1500);
            } finally {
                setSaveButtonDisabled(false)
            }
        } else {
            setContactAddedResponse("Enter Valid Number");
            setTimeout(() => {
                setContactAddedResponse("");
            }, 1500);
        }
    }

    return <div>
        {!isNewContactClicked ? <button onClick={() => setIsNewContactClicked(!isNewContactClicked)}>New Contact</button> : <div>
            <input type="text" inputMode='numeric' pattern='[0-9]*' minLength={10} maxLength={10} onChange={(e) => setNewContact(e.target.value)} />
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave} disabled={saveButtonDisabled}>Save</button>
            <span style={{ color: 'red', marginLeft: '5px' }}>{contactAddedResponse}</span>
        </div>}

    </div>
}