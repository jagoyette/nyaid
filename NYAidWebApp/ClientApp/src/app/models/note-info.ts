export class NoteInfo {
    noteId: string;     // The unique identifier of this note
    offerId: string;    // The unique identifier of the offer that this note is associated with
    authorUid: string;  // The unique identifier of the user that created the note
    created: Date;      // Timestamp indicating when the note was created
    noteText: string;   // Text string of the note to be associated with the offer
}
