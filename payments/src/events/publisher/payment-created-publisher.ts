import {Publisher, Subjects, PaymentCreatedEvent} from '@bhticketsell/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}