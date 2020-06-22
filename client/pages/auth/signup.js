import React, { useState, useRef } from 'react';

import Router from 'next/router';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Schema, Message } from 'rsuite';

import useRequest from '../../hooks/use-request';
const { StringType, NumberType } = Schema.Types;
// Validation for the form.
const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email address.').isRequired('This field is required.'),
  password: StringType().isRequired('Password is required.')
});

export default function signup() {
  const formElement = useRef(null);

  const {doRequest, errors} = useRequest({
    url: '/api/users/signup',
    method: 'post',
    onSuccess: () => Router.push('/')
  })


  const handleSubmit = async (e) => {
    // Get the email and password.
    const { email, password } = formElement.current.getFormValue();
    if (!formElement.current.check()) {
      return;
    }  
    doRequest({email, password});
  };

  return (
    <div>
      <Form layout="inline" model={model} onSubmit={handleSubmit} ref={formElement}>
        <FormGroup>
          <ControlLabel>Email</ControlLabel>
          <FormControl name="email" style={{ width: 160 }} />
          <HelpBlock tooltip>Required</HelpBlock>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Password</ControlLabel>
          <FormControl name="password" type="password" style={{ width: 160 }} />
        </FormGroup>

        <Button appearance="primary" type="submit">
          Login
        </Button>

        {errors}
      </Form>
    </div>
  );
}
