import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function  Nofify() {
  const [state, handleSubmit] = useForm("mdkgndaj");
  if (state.succeeded) {
      return <p className='text-center text-green-500 animate-pulse'>Thanks for joining!</p>;
  }
  return (
    <form onSubmit={handleSubmit} className='flex items-center flex-col p-4 w-xl mx-auto gap-4 bg-gray-50 rounded-2xl shadow'>
      <label htmlFor="email">
        Email Address
      </label>
      <input
        id="email"
        type="email" 
        name="email"
        value="dev@qurvii.com"
        className='border border-gray-200 py-2 px-4 outline-blue-500'
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
      <textarea
        id="message"
        name="message"
        value="Someone download reset file "
        className='border hidden'
      />
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
      <button type="submit" className='border py-2 px-4 rounded cursor-pointer hover:bg-gray-200 duration-75 border-gray-200' disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}

export default Nofify;