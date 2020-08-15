import {useState} from 'react';
import {Message} from 'rsuite';

import axios from 'axios';

export default function ({url, method, onSuccess}) {
  const [errors, setErrors] = useState(null);

  const doRequest = async (body) => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }      
    } catch(err) {
      setErrors(
        <Message className="message" type="error" description={
            <>
            <h4>Oops.</h4>
            <ul>
              {err.response.data.errors.map(error => <li key={error.message}>{error.message}</li>)}
            </ul>
            </>
            
          } />
      )
    }
  }

  return {doRequest, errors};
}
