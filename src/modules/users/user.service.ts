import { pool } from "../../config/db"

const getUsers = async() => {
    const result = await pool.query(`select id, name, email, phone, role from users`);
    return result.rows;
}

const updateUser = async(userId: number, data: any) => {
    const temp = [ "name", "email", "phone", "role"];
    const feilds : string[] = [];
    const values : any[] = [];
    let index = 1;
    for(const key in data){
        if(temp.includes(key)){
            feilds.push(`${key} = $${index}`);
            values.push(data[key]);
            index++;
        }
    }

    if(feilds.length === 0){
        throw new Error("No data provided to update");
    }

    const query = `update users set ${feilds.join(", ")} where id = ${userId} returning id, name, email, phone, role`;

    const result = await pool.query(query,values);
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return result.rows[0];
}

// const deleteUser = async() 

export const userService = {
    getUsers,
    updateUser
}