import styled from 'styled-components'
import { FiTrash2 } from 'react-icons/fi';
import EditableField from './EditableField';

const Expense = ( {expenseDetails, setUpdateData, tripId} ) => {

    const { name, category, date, amount, expenseId } = expenseDetails; 

    const handleDelete = () => {
        fetch(`/deleteExpense/${tripId}/${expenseId}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then((data) => {
                setUpdateData(data)
                console.log(data)
                })
        .catch((err) => {
                console.log(err); 
    })
    }

    return (
        <tr>
            <td><EditableField initialValue={name} inputType="text" field="name" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={category} inputType="select" field="category" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={date} inputType="date" field="name" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><EditableField initialValue={amount} inputType="number" field="amount" tripId={tripId} expenseId={expenseId} setUpdateData={setUpdateData} /></td>
            <td><button onClick={handleDelete}><FiTrash2/></button></td>
        </tr>
    )
}


export default Expense;