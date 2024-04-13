import React, { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail , validatePassword } from '../utils/helper'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = (e) => {
    e.preventDefault();
    if(!email || !password){
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

    setError('');

    


     
  }


  return (
    <>
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>

          <input type="text" placeholder="Email" className="input-box"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}

           />
          <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button className="btn-primary text-white font-semibold p-3">Login</button>
          <p className="text-sm text-center mt-4">
            Not Register Yet?
             <Link to="/signUp" className="font-medium text-primary underline">
              Create an Account
              </Link>
          </p>
        </form>
      </div>
    </div>


    </>
  )
}

export default Login