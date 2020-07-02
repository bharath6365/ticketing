import {Publisher, Subjects, OrderCancelledEvent} from '@bhticketsell/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}