import {Publisher, Subjects, OrderCreatedEvent} from '@bhticketsell/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}