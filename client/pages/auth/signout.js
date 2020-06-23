import React, {useEffect, Fragment} from 'react';

import Router from 'next/router';

import useRequest from '../../hooks/use-request';

export default function signout() {
  const {doRequest} = useRequest({
    url: '/api/users/signout',
    method: 'get',
    onSuccess: () => Router.push('/')
  });

  useEffect(() => { 
    doRequest();  
  }, []);

  return (
    <h3>
      Signing you out.... Hang on.......
    </h3>
  )
}
