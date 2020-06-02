export class AcceptRejectOfferInfo {
    offerId: string;            // The unique identifier of the offer
    isAccepted: boolean;        // If true, the offer is accepted. otherwise it is rejected.
    acceptRejectReason: string; // Text indicating why the creator of the request accepted or rejected the offer
}
