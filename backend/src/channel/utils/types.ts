import { Channel } from "diagnostics_channel";

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

export type muteMember = {
    channelId: number;
    userId: number;
    userToMuteId: number;
}

export type updatePassword = {
    channel: Channel;
    password?: string;
}