import { NoteInfo } from "./note-info";

export class OfferInfo {
    offerId: string;        // Unique identifier of this offer
    requestId: string;      // The unique identifier of the request associated with this offer
    volunteerUid: string;   // Uid of the user submitting the offer
    created: Date;          // Timestamp indicating when the offer was submitted

    // Indicates the state of the offer: submitted - initial state of offer
    // accepted - user accepted offer
    // rejected - user rejected offer
    state:  'accepted' | 'rejected' | 'submitted ';
    description: string;        // Text indicating how the volunteer can help
    acceptRejectReason: string; // Text indicating why the creator of the request accepted or rejected the offer
    notes: NoteInfo[];          // Array of Note objects associated with the offer
}
