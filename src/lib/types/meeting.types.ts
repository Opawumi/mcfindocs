export interface Meeting {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    code: string;
    hostId: string;
    participants: string[];
    status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled';
    type: 'instant' | 'scheduled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateMeetingDTO {
    title: string;
    description?: string;
    startTime?: string;
    type: 'instant' | 'scheduled';
}
