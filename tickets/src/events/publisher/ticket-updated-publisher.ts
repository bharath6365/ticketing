import {Publisher, Subjects, TicketUpdatedEvent} from '@bhticketsell/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}