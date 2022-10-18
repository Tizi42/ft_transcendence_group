export type leavingChannel = {
    channelId: number;
    userId: number;
}

export type makingAdmin = {
    channelId: number;
    userId: number;
    newAdminId: number;
}

export type banMember = {
    channelId: number;
    userId: number;
    userToBanId: number;
}