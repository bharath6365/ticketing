import React, { useState, useRef } from 'react';

import Router from 'next/router';
import { Container, Content, FlexboxGrid, Panel, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Schema, Col } from 'rsuite';

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
    <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
            <Panel header={<h3>Signup</h3>} bordered>
              <Form fluid model={model} onSubmit={handleSubmit} ref={formElement}>
                <FormGroup>
                  <ControlLabel>Email</ControlLabel>
                  <FormControl name="email" />
                </FormGroup>

                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" />
                </FormGroup>

                <Button appearance="primary" type="submit">
                  Login
                </Button>

                {errors}
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
  );
}
