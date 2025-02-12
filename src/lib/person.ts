import { EventId, Person, Room } from '@wca/helpers';

export const hasAssignmentInRoom = (room: Room, person: Person) => {
  const roundActivities = room.activities.flatMap((ra) => ra.childActivities);
  const childActivityIds = roundActivities.map((a) => a.id);
  return person.assignments?.some((a) => childActivityIds.includes(a.activityId));
};

export const acceptedRegistration = ({ registration }: Person): boolean =>
  registration?.status === 'accepted';

export const isRegisteredForEvent =
  (eventId: EventId) =>
  ({ registration }: Person): boolean =>
    !!registration && registration.eventIds.includes(eventId);

export const isDelegate = ({ roles }: Person): boolean =>
  !!roles?.some((i) => i.includes('delegate'));

export const isOrganizer = ({ roles }: Person): boolean =>
  !!roles?.some((i) => i.includes('organizer'));

export const isStaff = (person: Person): boolean =>
  isDelegate(person) || isOrganizer(person) || !!person?.roles?.some((i) => i.includes('staff-'));
