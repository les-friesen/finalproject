import { FiTrash2 } from 'react-icons/fi';
import EditableField from './EditableField';
import { useAuth0 } from "@auth0/auth0-react";

const Expense = ( {expenseDetails, setUpdateData, tripId} ) => {

    const { getAccessTokenSilently } = useAuth0(); 
    const { name, category, date, amount, expenseId } = expenseDetails; 

    const handleDelete = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/deleteExpense/${tripId}/${expenseId}`, {
                method: "DELETE",
                headers : {
                    "authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
                setUpdateData(data)
                console.log(data)
        } catch (error) {
        console.log(error);
        }
    }

    return (
        <tr>
            <td><EditableField initialValue={name} inputType="text" field="name" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={category} inputType="select" field="category" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={date} inputType="date" field="date" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={amount} inputType="number" field="amount" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><button className="delete" onClick={handleDelete}><FiTrash2/></button></td>
        </tr>
    )
}

export default Expense;