import { useEffect, useState } from "react";
import { UserService, type User} from "../api/user-service";

const UserPage = () => {
    const [users, setUsers] = useState<User[]>();
    const signal = new AbortController();

    useEffect(() => {
        let random_offset = Math.floor(Math.random() * 178) + 1;
        const GetUsers = async() => {
            setUsers(await UserService.getUsers(random_offset, signal.signal));
            return ;
        }
        GetUsers();
    }, []);


    const ClickDelete = (id:number, index:number) => {
        const cloned_users = [...users!];
        const DeleteUser = async() => {
            const deleted = await UserService.deleteUser(id, signal.signal);
            cloned_users[index] = deleted;
            setUsers(cloned_users);
        }
        DeleteUser();
    }
    

    return (
        <div className="grid grid-cols-5 gap-4 m-2">
            {users && users.map((data, index) => {
                if (!data.isDeleted) {
                    return (
                        <div key={index} className="border-2 rounded border-blue-500 h-40 flex flex-col justify-between p-2">
                            <p className="text-gray-500 text-xs">User#{data.id}</p>
                            <div className="flex flex-col">
                                <p className="font-bold text-xl">{data.username}{String((new Date().getFullYear() - data.age) % 100).padStart(2, "0")}</p>
                                <p className="font-light text-xs">{data.firstName} {data.lastName}</p>
                            </div>
                            <button className="rounded border-red-500 bg-red-500 text-white hover:bg-red-600 focus:bg-red-700 cursor-pointer" onClick={() => ClickDelete(data.id, index)}>DELETE</button>
                        </div>
                    );
                }
            })}
        </div>
    )
}
export default UserPage;