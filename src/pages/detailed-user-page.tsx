import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { UserService, type User } from "../api/user-service";

type ParamterType = {
    UserId: string
}

const DetailedUserPage =() => {
    const {UserId} = useParams<ParamterType>();

    const navigate = useNavigate();
    
    const TrueUserId = Number(UserId);

    const [UserData, SetUser] = useState<User>();

    useEffect(() => {
        const controller = new AbortController();

        const getUserId = async () => {
            try {
                const data = await UserService.getUserById(TrueUserId, controller.signal);
                SetUser(data);
            }
            catch (error) {
                if (!controller.signal.aborted) {
                    console.error(error);
                }
            }
        };

        getUserId();

        return () => controller.abort();
    }, [TrueUserId]);

    return (
        <div className="border-2 rounded border-blue-500 h-40 flex flex-col justify-between p-2">
            <p className="text-gray-500 text-xs">User#{UserData?.id}</p>
            <div className="flex flex-col">
                <p className="font-bold text-xl">{UserData?.username}{String((new Date().getFullYear() - (UserData ? UserData.age : 0)) % 100).padStart(2, "0")}</p>
                <p className="font-light text-xs">{UserData?.firstName} {UserData?.lastName}</p>
            </div>
            <div className="flex flex-row p-2 justify-between items-center gap-6">
                <button className={`rounded border-blue-500 bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 cursor-pointer grow p-4 ${TrueUserId === 1 ? "hidden" : ""}`} onClick={() => navigate(`/detailed-user-page/${TrueUserId-1}`)}>Go back</button>
                <button className={`rounded border-blue-500 bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 cursor-pointer grow p-4 ${TrueUserId === 208 ? "hidden" : ""}`} onClick={() => navigate(`/detailed-user-page/${TrueUserId+1}`)}>Go Forwards</button>
            </div>
        </div>
    )
}

export default DetailedUserPage;