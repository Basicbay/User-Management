import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import avatar from './image/avatar.png'


function EditUser() {

    const Alert = (formData) => {
        Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: "Save"
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                // This will send a post request to update the data in the database.
                await fetch(`http://localhost:5000/update/${params.id}`, {
                    method: "POST",
                    body: formData,
                });
                Swal.fire("Saved!", "", "success");
                navigate('/');
            }
        });
    }

    const [form, setForm] = useState({
        fname: "",
        lname: "",
        gender: "",
        birthday: "",
        image: "",
    });

    // Add a new state variable to hold the preview URL
    const [previewUrl, setPreviewUrl] = useState('');
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            const id = params.id?.toString();
            const response = await fetch(`http://localhost:5000/user/${params.id?.toString()}`);
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const user = await response.json();
            if (!user) {
                window.alert(`User with id ${id} not found`);
                navigate("/");
                return;
            }
            setForm(user);
        }
        fetchData();
        return;
    }, [params.id, navigate]);

    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    //Delete Image
    const deleteImage = () => {
        updateForm({ image: null });
    };

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fname', form.fname);
        formData.append('lname', form.lname);
        formData.append('gender', form.gender);
        formData.append('birthday', form.birthday);
        formData.append('image', form.image); // Append the image file


        Alert(formData);
        //navigate('/');
    }

    return (
        <div className=''>

            <div className='relative flex h-20 px-10 items-center justify-between'>
                <div className='font-medium text-xl text-slate-400'>Edit User</div>
                <Link to={`/create`}><button className='rounded-lg  text-white px-8 py-2' style={{ background: '#008FFF' }}>Add +</button></Link>
            </div>

            <form onSubmit={onSubmit} className=' m-auto max-w-6xl md:px-20 xl:px-0'>
                <div className=' grid xl:grid-cols-3 gap-10 xl:gap-5  '>

                    <div className='grid gap-4 text-center '>
                        {previewUrl ? (
                            <img className="w-44 h-44 rounded-full m-auto" src={previewUrl} alt="" />
                        ) : form.image && form.image !== 'null' ? (
                            <img className="w-44 h-44 rounded-full m-auto" src={`http://localhost:5000/uploads/${form.image}`} alt="" />
                        ) : (
                            <img className="w-44 h-44 rounded-full m-auto" src={avatar} alt="" />
                        )}
                        <div>
                            <label htmlFor="file-upload" className="rounded-lg text-white text-sm px-5 py-2 cursor-pointer" style={{ background: '#008FFF' }}>
                                Upload Profile Picture
                                <input id="file-upload" type="file" className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) {
                                            // Update the preview URL
                                            setPreviewUrl(URL.createObjectURL(file));
                                            // Update the form state with the selected file
                                            updateForm({ image: file });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div><button onClick={deleteImage} type='button' className='rounded-lg text-white text-sm px-5 py-2' style={{ background: '#FF0000' }}>Delete Picture</button></div>

                    </div>

                    <div className='grid xl:grid-cols-2 xl:col-span-2 gap-5 place-content-center text-black    '>

                        <div className='flex flex-col'>
                            <label className="p-1  ">First Name</label>
                            <input
                                className=" border-[1px] rounded-lg p-2"
                                type="text"
                                id='fname'
                                placeholder='Please enter First name'
                                value={form.fname}
                                onChange={(e) => updateForm({ fname: e.target.value })}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Last Name</label>
                            <input
                                className=" border-[1px] rounded-lg p-2 "
                                type="text"
                                id='lname'
                                placeholder='Please enter Last name'
                                value={form.lname}
                                onChange={(e) => updateForm({ lname: e.target.value })}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Gender</label>
                            <select
                                className="border-[1px] rounded-lg p-2   "
                                name="option"
                                id='gender'
                                value={form.gender}
                                onChange={(e) => updateForm({ gender: e.target.value })}
                                required
                            >
                                <option value="" disabled selected>-- Please Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className="p-1  ">Birthday</label>
                            <input
                                className='border-[1px] rounded-lg p-2 '
                                type="date"
                                id="birthday"
                                placeholder="dd-mm-yyyy"
                                value={form.birthday}
                                onChange={(e) => updateForm({ birthday: e.target.value })}
                                required
                            />
                        </div>

                    </div>
                </div>

                <div className='flex gap-5 my-16 justify-center xl:justify-end '>
                    <Link to={`/`}><button className='rounded-lg text-white w-32  py-1' style={{ background: '#9C9C9C' }}>CANCEL</button></Link>
                    <button type='submit' className='rounded-lg text-white w-32  py-1' style={{ background: '#06DC2D' }}>SAVE</button>
                </div>

            </form>
        </div>
    )
}

export default EditUser