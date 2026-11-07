import api from "./dummy-json-instance.js";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    username: string;
    isDeleted?: boolean;
}

export class UserService{
    static getUsers = async(offset:number,signal:AbortSignal):Promise<User[]>=>{
        const response = await api.get(`/users?skip=${offset}`, {signal});
        return response.data?.users;
    }
    static deleteUser = async(id:number, signal:AbortSignal):Promise<User>=>{
        const response = await api.delete(`/users/${id}`, {signal});
        return response.data;
    }
    static getUserById = async(id:number, signal:AbortSignal):Promise<User>=>{
        const response = await api.get(`/users/${id}`, {signal});
        return response.data;
    }
    static addUser = async(userData:User, signal:AbortSignal):Promise<User>=> {
        const {id, ...seperatedData} = userData;
        const response = await api.post("/users/add", seperatedData, {signal});
        return response.data;
    }
    static updateUser = async(updateData:User, signal:AbortSignal): Promise<User>=> {
        const {id, ...seperatedData} = updateData;
        const response = await api.put(`/users/${id}`, seperatedData, {signal});
        return response.data;
    }
}