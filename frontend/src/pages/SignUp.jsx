import React, { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail , validatePassword } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'



const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if(!name || !email || !password){
      setError("Please fill all the fields")
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
    if(password.length < 8){
      setError("Password must be at least 8 characters");
      return;
    }
    if(!validatePassword(password)){
      setError("Password must contain at least one uppercase, lowercase, number and special character");
      return;
    }


    // API call to signup user
    try {
      
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password
      });
        if(response.data && response.data.error){
          setError(response.data.message);
          return;
        }

      if(response.data && response.data.accessToken){
        alert("Account created successfully.");
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');

      }


    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);

      }else{
        setError("Something went wrong. Please try again later");
      }
      
    }
    setError('');
     
  }


  return (
    <>
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignup}>
          <h4 className="text-2xl mb-7">SignUp</h4>
          <input type="text" placeholder="Name" className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
           />
          <input type="email" placeholder="Email" className="input-box"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}

           />
          <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button className="btn-primary text-white font-semibold p-3">
          Create Account
            </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
             <Link to="/login" className="font-medium text-primary underline">
              Login
              </Link>
          </p>
        </form>
      </div>
    </div>


    </>
  )
}

export default SignUp