import {Publisher, Subjects, TicketCreatedEvent} from '@bhticketsell/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}