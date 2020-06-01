export class RequestInfo {
    requestId: string;
    creatorUid: string;
    assignedUid: string;
    state: 'open' | 'inProcess' | 'closed';
    name: string;
    location: string;
    phone: string;
    description: string;
}
