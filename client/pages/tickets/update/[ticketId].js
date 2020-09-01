import React, { useState, useRef } from 'react';

import Router from 'next/router';
import {
  Content,
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button,
  Schema,
  Notification,
  Col
} from 'rsuite';

import useRequest from '../../../hooks/use-request';
const { StringType, NumberType } = Schema.Types;
// Validation for the form.
const model = Schema.Model({
  title: StringType().isRequired('Ticket title is required'),
  price: NumberType().min(200, 'Price field must be greater than 200 (INR)').isRequired('Price is required'),
  description: StringType().maxLength(50, 'Maximum of 50 characters is supported').isRequired('Description is required')
});

export default function updateTicket({ticket}) {
  const formElement = useRef(null);

  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: 'put',
    onSuccess: () => handleSuccess()
  });

  const handleSuccess = () => {
    Notification.success({
      title: 'Success',
      description: 'Ticket has been updated.'
    });

    Router.push('/')

  };

  const handleSubmit = async (e) => {
    // Get the email and password.
    const { title, price, description } = formElement.current.getFormValue();
    if (!formElement.current.check()) {
      return;
    }
    doRequest({ title, price, description });
  };


  return (
    <Content>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
          <Panel header={<h3>Update Ticket</h3>} bordered>
            <Form formDefaultValue={ticket} fluid model={model} onSubmit={handleSubmit} ref={formElement}>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title"/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Price in INR</ControlLabel>
                <FormControl name="price" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl componentClass="textarea" name="description" />
              </FormGroup>

              <Button appearance="primary" type="submit">
                Submit
              </Button>

              {errors}
            </Form>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Content>
  );
}

updateTicket.getInitialProps = async (context, client) => {
  // Gets the ticketId out of the URL.
  const { ticketId } = context.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data};
};
