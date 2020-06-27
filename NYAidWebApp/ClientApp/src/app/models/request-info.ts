export class RequestInfo {
    requestId: string;
    creatorUid: string;
    assignedUid: string;
    state: 'open' | 'inProcess' | 'closed';
    created: Date;
    name: string;
    location: string;
    phone: string;
    description: string;
}
