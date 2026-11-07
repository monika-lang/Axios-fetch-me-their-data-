import { useForm, type SubmitHandler } from "react-hook-form";
import { UserService, type User } from "../api/user-service";
import { useEffect, useState, type ChangeEvent } from "react";

const UserCreateUpdatePage = () => {
    const {register, handleSubmit, reset, formState:{errors, isDirty}} = useForm<User>();

    const abortController = new AbortController();
    const [UserData, SetUserData] = useState<User>();
    const [DisplayedUserData, SetDisplayedUserData] = useState<User>();
    const [id, SetId] = useState(1);
    const idChanger = (e:ChangeEvent<HTMLInputElement>) => {
        if (e.target.valueAsNumber > 208) {
            return;
        }
        else if (e.target.valueAsNumber < 1) {
            return;
        }
        else {
            SetId(e.target.valueAsNumber);
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        const GetUserData = async () => {
            try {
                const data = await UserService.getUserById(
                    id,
                    controller.signal
                );

                return data;
            }
            catch (error) {
                if (!controller.signal.aborted) {
                    console.error(error);
                }
            }
        };

        GetUserData().then(data => {
            reset(data);
            SetUserData(data);
            SetDisplayedUserData(data);
        });

        return () => {
            controller.abort();
        };
    }, [id]);

    const [updateProfileBoolean, setUpdateBoolean] = useState(false);
    const [CreateProfileBoolean, setCreationBoolean] = useState(false);

    const checkboxChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;

        if (name === "create") {
            if (CreateProfileBoolean) {
                setCreationBoolean(false);
            }
            else {
                setCreationBoolean(true);
                SetDisplayedUserData(undefined);
                reset({
        firstName: "",
        lastName: "",
        age: 0,
        username: ""
    });
                if (updateProfileBoolean) {
                    setUpdateBoolean(false);
                }
            }
        }
        else if (name === "update") {
            if (updateProfileBoolean) {
                setUpdateBoolean(false);
            }
            else {
                setUpdateBoolean(true);
                SetDisplayedUserData(UserData);
                reset(UserData);
                if (CreateProfileBoolean) {
                    setCreationBoolean(false);
                }
            }
        }
    }

    const [FormStyle, setFormStyle] = useState("flex flex-col items-center justify-center gap-6"); 

    useEffect(() => {
        if (CreateProfileBoolean || updateProfileBoolean) {
            setFormStyle("flex flex-col items-center justify-center gap-6");
        }
        else {
            setFormStyle("hidden");
        }
    }, [CreateProfileBoolean, updateProfileBoolean]);

    const onSubmit:SubmitHandler<User> = (data:User) => {
        const post = async() => {
            const newUser = await UserService.addUser(data, abortController.signal);

            SetUserData(newUser);
            SetDisplayedUserData(newUser);
        }
        const put = async() => {
            const newUser = await UserService.updateUser(data, abortController.signal);

            SetUserData(newUser);
            SetDisplayedUserData(newUser);
        }

        if (CreateProfileBoolean) {
            post();
        }
        if (updateProfileBoolean) {
            put();
        }
    }
    

    return (
        <div className="flex flex-col justify-center items-center">

            <div className="flex flex-col">
                <div className="flex flex-row"><label htmlFor="create">Create user:</label>
                <input type="checkbox" name="create" id="create" checked={CreateProfileBoolean} onChange={checkboxChangeHandler}/></div>
                <div className="flex flex-row">
                    <label htmlFor="update">Update user:</label>
                    <input type="checkbox" name="update" id="update" checked={updateProfileBoolean} onChange={checkboxChangeHandler}/>
                </div>
                
            </div>

            <form action="post" className={FormStyle} onSubmit={handleSubmit(onSubmit)}>

                <div className={`flex flex-col w-60 ${updateProfileBoolean ? "" : "hidden"}`}>
                    <label htmlFor="id" className="text-xs">Id:</label>
                    <input type="number" className={`p-2 border-2 border-blue-500 rounded-2xl ${!updateProfileBoolean ? "hidden": ""}`} id="id" value={id} onChange={idChanger}/>
                </div>

                <div className="flex flex-col w-100">
                    <label htmlFor="firstName" className="text-xs">First name:</label>
                    <input type="text" className="p-2 border-2 border-blue-500 rounded-2xl" {...register("firstName", {
                        required: "Field must not be empty."
                    })}/>
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>
                <div className="flex flex-col w-100">
                    <label htmlFor="lastName" className="text-xs">Last name:</label>
                    <input type="text" className="p-2 border-2 border-blue-500 rounded-2xl" {...register("lastName", {
                        required: "Field must not be empty."
                    })}/>
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                </div>
                <div className="flex flex-col w-100">
                    <label htmlFor="age" className="text-xs">Age:</label>
                    <input type="number" className="p-2 border-2 border-blue-500 rounded-2xl" {...register("age", {
                        valueAsNumber:true
                    })}/>
                    {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
                </div>
                <div className="flex flex-col w-100">
                    <label htmlFor="username" className="text-xs">Username:</label>
                    <input type="text" className="p-2 border-2 border-blue-500 rounded-2xl" {...register("username", {
                        required: "Field must not be empty."
                    })} />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                </div>
                <button type="submit" className={`border p-2 rounded-2xl ${isDirty ? "border-blue-600 hover:bg-blue-300 focus:bg-blue-600" : "border-red-600 bg-red-400"}`} disabled={!isDirty}>{isDirty ? (updateProfileBoolean ? "Save changes" : "Add user") : (updateProfileBoolean ? "No changes have been made" : "no data has been input")}</button>
            </form>
            <div className={`${CreateProfileBoolean || updateProfileBoolean ? "" : "hidden"}`}>
                <div>
                    <h1>Id: {DisplayedUserData?.id}</h1>
                    <h1>First name: {DisplayedUserData?.firstName}</h1>
                    <h1>Last name: {DisplayedUserData?.lastName}</h1>
                    <h1>Age: {DisplayedUserData?.age}</h1>
                    <h1>Username: {DisplayedUserData?.username}</h1>
                </div>
                
            </div>
        </div>
    )
}

export default UserCreateUpdatePage;