import { Publisher, Subjects, ExpirationCompleteEvent } from '@bhticketsell/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}